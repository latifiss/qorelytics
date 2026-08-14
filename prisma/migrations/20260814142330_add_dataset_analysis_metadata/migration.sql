-- AlterTable
ALTER TABLE "Analysis" ADD COLUMN     "completedAt" TIMESTAMP(3),
ADD COLUMN     "errorMessage" TEXT,
ADD COLUMN     "startedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Dataset" ADD COLUMN     "columnCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "errorMessage" TEXT,
ADD COLUMN     "profile" JSONB,
ADD COLUMN     "rowCount" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE INDEX "Analysis_datasetId_createdAt_idx" ON "Analysis"("datasetId", "createdAt");

-- CreateIndex
CREATE INDEX "Dataset_userId_createdAt_idx" ON "Dataset"("userId", "createdAt");
