-- AlterTable
ALTER TABLE "assignments" ADD COLUMN     "chat_id" TEXT;

-- AddForeignKey
ALTER TABLE "assignments" ADD CONSTRAINT "assignments_chat_id_fkey" FOREIGN KEY ("chat_id") REFERENCES "chats"("id") ON DELETE CASCADE ON UPDATE CASCADE;
