import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { auth } from '@/src/lib/auth/auth';
import { prisma } from '@/src/lib/db/prisma';
import { getFromR2 } from '@/src/lib/storage/r2';
import { getFileExtension } from '@/src/lib/validation/dataset';
import { parseDataset } from '@/src/lib/data/parser';
import { profileDataset } from '@/src/lib/data/profiler';
import { runAnalysis, type AnalysisMessage } from '@/src/lib/ai/analyzer';

interface RouteContext { params: Promise<{ datasetId: string }> }
interface AnalyzeRequestBody { provider?: string; model?: string; userQuestion?: string; messages?: AnalysisMessage[] }
export const runtime = 'nodejs';

export async function POST(request: Request, context: RouteContext) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { datasetId } = await context.params;
    const body = (await request.json().catch(() => ({}))) as AnalyzeRequestBody;
    const provider = body.provider?.trim() || 'openrouter';
    // Keep the Paddle branch analyzer exactly as-is; only swap the model to a free OpenRouter model.
    const model = 'minimax/minimax-m3:free';
    const userQuestion = body.userQuestion?.trim();
    const messages = Array.isArray(body.messages) ? body.messages : [];

    const dataset = await prisma.dataset.findFirst({
      where: { id: datasetId, userId: session.user.id },
      select: { id: true, fileUrl: true, originalFileName: true, fileType: true, profile: true },
    });

    if (!dataset) return NextResponse.json({ error: 'Dataset not found.' }, { status: 404 });
    if (!dataset.fileUrl) return NextResponse.json({ error: 'The original dataset file could not be located.' }, { status: 400 });

    const fileBuffer = await getFromR2(dataset.fileUrl);
    if (!fileBuffer.length) return NextResponse.json({ error: 'The stored dataset file is empty.' }, { status: 400 });

    const extension = getFileExtension(dataset.originalFileName);
    const file = new File([fileBuffer], dataset.originalFileName, { type: dataset.fileType || 'application/octet-stream' });
    const parsedDataset = await parseDataset(file, extension);

    if (!parsedDataset.rows.length) return NextResponse.json({ error: 'The stored dataset contains no rows.' }, { status: 400 });
    if (!parsedDataset.columns.length) return NextResponse.json({ error: 'No columns could be detected in the stored dataset.' }, { status: 400 });

    const datasetProfile = profileDataset(parsedDataset.rows, parsedDataset.columns);
    const analysis = await prisma.analysis.create({
      data: { datasetId: dataset.id, provider, model, status: 'RUNNING', startedAt: new Date() },
    });

    try {
      const isFollowUp = messages.length > 1;
      const analysisQuestion = isFollowUp && userQuestion
        ? `FOLLOW-UP MODE: Answer only the user's current follow-up question. Use the previous conversation, the original analysis, the deterministic dataset analysis, and the actual dataset as context. Do NOT repeat the original full analysis or recreate its report. Be concise and directly answer the question. Only include a chart if it materially helps answer this specific question; reuse/reference a previous finding or chart when possible. Do not generate multiple charts for a follow-up. Do not restate the dataset overview, limitations, or recommendations unless they are directly relevant to the question.\n\nCURRENT FOLLOW-UP QUESTION:\n${userQuestion}`
        : userQuestion;

      const result = await runAnalysis({
        dataset: datasetProfile,
        rows: parsedDataset.rows,
        messages,
        userQuestion: analysisQuestion,
        model,
      });

      const completedAnalysis = await prisma.analysis.update({
        where: { id: analysis.id },
        data: { result, status: 'COMPLETED', completedAt: new Date() },
        select: { id: true, datasetId: true, provider: true, model: true, result: true, status: true, startedAt: true, completedAt: true, createdAt: true },
      });

      if (userQuestion && typeof result.response === 'string') {
        const existingChat = await prisma.chatSession.findFirst({
          where: { userId: session.user.id, datasetId: dataset.id },
          select: { id: true },
        });

        const chat = existingChat
          ? existingChat
          : await prisma.chatSession.create({
              data: {
                userId: session.user.id,
                datasetId: dataset.id,
                title: userQuestion.slice(0, 120) || 'New chat',
              },
              select: { id: true },
            });

        await prisma.chatSession.update({
          where: { id: chat.id },
          data: {
            updatedAt: new Date(),
            messages: {
              create: [
                { role: 'USER', content: userQuestion },
                { role: 'ASSISTANT', content: result.response, result },
              ],
            },
          },
        });
      }

      return NextResponse.json({ analysis: completedAnalysis });
    } catch (analysisError) {
      await prisma.analysis.update({
        where: { id: analysis.id },
        data: { status: 'FAILED', errorMessage: analysisError instanceof Error ? analysisError.message : 'Analysis failed.' },
      });
      throw analysisError;
    }
  } catch (error) {
    console.error('POST /api/datasets/[datasetId]/analyze failed:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Failed to analyze dataset.' }, { status: 500 });
  }
}
