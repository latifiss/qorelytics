-- Store the structured analysis result alongside each assistant chat message.
ALTER TABLE "Message" ADD COLUMN "result" JSONB;

-- Speed up loading a user's most recently updated chat history.
CREATE INDEX "ChatSession_userId_updatedAt_idx" ON "ChatSession"("userId", "updatedAt");
