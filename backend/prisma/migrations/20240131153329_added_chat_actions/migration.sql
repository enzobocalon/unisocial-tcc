-- CreateEnum
CREATE TYPE "ChatActionsEnum" AS ENUM ('JOIN', 'LEAVE', 'CREATE');

-- CreateTable
CREATE TABLE "chat_actions" (
    "id" TEXT NOT NULL,
    "chat_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "action" "ChatActionsEnum" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "chat_actions_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "chat_actions" ADD CONSTRAINT "chat_actions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_actions" ADD CONSTRAINT "chat_actions_chat_id_fkey" FOREIGN KEY ("chat_id") REFERENCES "chats"("id") ON DELETE CASCADE ON UPDATE CASCADE;
