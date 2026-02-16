-- AlterTable
ALTER TABLE "assignments_actions" ADD COLUMN     "task_id" TEXT;

-- AddForeignKey
ALTER TABLE "assignments_actions" ADD CONSTRAINT "assignments_actions_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "assignments_tasks"("id") ON DELETE CASCADE ON UPDATE CASCADE;
