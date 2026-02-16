-- AlterEnum
ALTER TYPE "ChatActionsEnum" ADD VALUE 'DELETE';

-- DropForeignKey
ALTER TABLE "assignments_tasks_files" DROP CONSTRAINT "assignments_tasks_files_user_id_fkey";

-- DropForeignKey
ALTER TABLE "assignments_tasks_users" DROP CONSTRAINT "assignments_tasks_users_user_id_fkey";

-- AddForeignKey
ALTER TABLE "assignments_tasks_users" ADD CONSTRAINT "assignments_tasks_users_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "assignments_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assignments_tasks_files" ADD CONSTRAINT "assignments_tasks_files_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "assignments_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
