-- AlterTable
ALTER TABLE "chat_actions" ADD COLUMN     "action_author_id" TEXT;

-- AddForeignKey
ALTER TABLE "chat_actions" ADD CONSTRAINT "chat_actions_action_author_id_fkey" FOREIGN KEY ("action_author_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
