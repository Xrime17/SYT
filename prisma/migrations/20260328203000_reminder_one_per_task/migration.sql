-- Один Reminder на задачу: дедупликация (приоритет unsent, затем меньший id), затем unique(taskId).
DELETE FROM "Reminder" r
WHERE r.id NOT IN (
  SELECT id FROM (
    SELECT DISTINCT ON ("taskId") id
    FROM "Reminder"
    ORDER BY "taskId", sent ASC, id ASC
  ) AS keep_one
);

DROP INDEX IF EXISTS "Reminder_taskId_idx";

CREATE UNIQUE INDEX "Reminder_taskId_key" ON "Reminder"("taskId");

ALTER TABLE "Reminder" DROP CONSTRAINT IF EXISTS "Reminder_taskId_fkey";
ALTER TABLE "Reminder" ADD CONSTRAINT "Reminder_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;
