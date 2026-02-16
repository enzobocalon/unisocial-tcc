/*
  Warnings:

  - You are about to drop the column `group_id` on the `chat_users` table. All the data in the column will be lost.
  - You are about to drop the column `chatId` on the `messages` table. All the data in the column will be lost.
  - You are about to drop the column `group_id` on the `messages` table. All the data in the column will be lost.
  - Added the required column `chat_id` to the `chat_users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `chat_id` to the `messages` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "messages" DROP CONSTRAINT "messages_chatId_fkey";

-- AlterTable
ALTER TABLE "chat_users" DROP COLUMN "group_id",
ADD COLUMN     "chat_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "messages" DROP COLUMN "chatId",
DROP COLUMN "group_id",
ADD COLUMN     "chat_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "chat_users" ADD CONSTRAINT "chat_users_chat_id_fkey" FOREIGN KEY ("chat_id") REFERENCES "chats"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_chat_id_fkey" FOREIGN KEY ("chat_id") REFERENCES "chats"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
