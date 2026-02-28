-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "recurringRuleId" TEXT;

-- CreateIndex
CREATE INDEX "Task_recurringRuleId_idx" ON "Task"("recurringRuleId");

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_recurringRuleId_fkey" FOREIGN KEY ("recurringRuleId") REFERENCES "RecurringRule"("id") ON DELETE SET NULL ON UPDATE CASCADE;
