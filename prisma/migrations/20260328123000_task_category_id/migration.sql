-- AlterTable
ALTER TABLE "Task" ADD COLUMN "categoryId" TEXT;

-- CreateIndex
CREATE INDEX "Task_categoryId_idx" ON "Task"("categoryId");

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "HomeCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;
