ALTER TABLE "user"
ADD COLUMN "tier" TEXT NOT NULL DEFAULT 'free',
ADD COLUMN "paddleCustomerId" TEXT,
ADD COLUMN "paddleSubscriptionId" TEXT,
ADD COLUMN "paddleSubscriptionStatus" TEXT,
ADD COLUMN "paddlePriceId" TEXT,
ADD COLUMN "paddleCurrentPeriodEnd" TIMESTAMP(3);

CREATE UNIQUE INDEX "user_paddleCustomerId_key" ON "user"("paddleCustomerId");
CREATE UNIQUE INDEX "user_paddleSubscriptionId_key" ON "user"("paddleSubscriptionId");

CREATE TABLE "PaddleEvent" (
  "id" TEXT NOT NULL,
  "eventId" TEXT NOT NULL,
  "eventType" TEXT NOT NULL,
  "processedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "PaddleEvent_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "PaddleEvent_eventId_key" ON "PaddleEvent"("eventId");
CREATE INDEX "PaddleEvent_eventType_idx" ON "PaddleEvent"("eventType");
