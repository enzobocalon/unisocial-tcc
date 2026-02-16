-- AddForeignKey
ALTER TABLE "assignments_tasks" ADD CONSTRAINT "assignments_tasks_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "assignments_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
