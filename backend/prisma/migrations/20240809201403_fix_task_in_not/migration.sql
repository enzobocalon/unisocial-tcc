-- AddForeignKey
ALTER TABLE "notification_objects" ADD CONSTRAINT "notification_objects_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "assignments_tasks"("id") ON DELETE CASCADE ON UPDATE CASCADE;
