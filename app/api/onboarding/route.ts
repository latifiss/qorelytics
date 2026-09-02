import { NextResponse } from "next/server";
import { auth } from "@/src/lib/auth/auth";
import { prisma } from "@/src/lib/db/prisma";

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    });

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const data = await req.json();

    // Only persist fields that exist on the Profile model.
    // Other onboarding answers can be added to the schema later without
    // causing the completion request to fail.
    const profileData = {
      role: typeof data.role === "string" ? data.role : undefined,
      industry:
        typeof data.industry === "string" ? data.industry : undefined,
      onboardingCompleted: true,
    };

    await prisma.profile.upsert({
      where: {
        userId: session.user.id,
      },
      update: profileData,
      create: {
        userId: session.user.id,
        ...profileData,
      },
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
