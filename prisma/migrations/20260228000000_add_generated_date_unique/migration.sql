-- AlterTable
ALTER TABLE "Task" ADD COLUMN "generatedDate" TIMESTAMP(3);

-- Backfill: set generatedDate from createdAt (start of day) for tasks that have recurringRuleId
UPDATE "Task"
SET "generatedDate" = date_trunc('day', "createdAt")
WHERE "recurringRuleId" IS NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Task_recurringRuleId_generatedDate_key" ON "Task"("recurringRuleId", "generatedDate");
