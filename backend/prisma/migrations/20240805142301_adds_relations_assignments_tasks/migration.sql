-- AddForeignKey
ALTER TABLE "assignments_tasks" ADD CONSTRAINT "assignments_tasks_assignment_id_fkey" FOREIGN KEY ("assignment_id") REFERENCES "assignments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
