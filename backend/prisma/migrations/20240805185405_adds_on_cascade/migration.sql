-- DropForeignKey
ALTER TABLE "assignments_actions_users" DROP CONSTRAINT "assignments_actions_users_assignments_actions_id_fkey";

-- DropForeignKey
ALTER TABLE "assignments_actions_users" DROP CONSTRAINT "assignments_actions_users_user_id_fkey";

-- DropForeignKey
ALTER TABLE "assignments_tasks" DROP CONSTRAINT "assignments_tasks_owner_id_fkey";

-- DropForeignKey
ALTER TABLE "assignments_users" DROP CONSTRAINT "assignments_users_assignmentsTasksTopicsId_fkey";

-- AddForeignKey
ALTER TABLE "assignments_actions_users" ADD CONSTRAINT "assignments_actions_users_assignments_actions_id_fkey" FOREIGN KEY ("assignments_actions_id") REFERENCES "assignments_actions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assignments_actions_users" ADD CONSTRAINT "assignments_actions_users_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assignments_users" ADD CONSTRAINT "assignments_users_assignmentsTasksTopicsId_fkey" FOREIGN KEY ("assignmentsTasksTopicsId") REFERENCES "assignments_tasks_topics"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assignments_tasks" ADD CONSTRAINT "assignments_tasks_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "assignments_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
