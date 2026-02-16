-- DropForeignKey
ALTER TABLE "assignments_actions_users" DROP CONSTRAINT "assignments_actions_users_user_id_fkey";

-- AddForeignKey
ALTER TABLE "assignments_actions_users" ADD CONSTRAINT "assignments_actions_users_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "assignments_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
