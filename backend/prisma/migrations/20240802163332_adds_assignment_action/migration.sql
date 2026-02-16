/*
  Warnings:

  - Added the required column `name` to the `assignments_tasks` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "assignments_tasks" ADD COLUMN     "name" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "assignments_actions" (
    "id" TEXT NOT NULL,
    "chat_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "action" "ChatActionsEnum" NOT NULL,
    "message" TEXT,
    "action_author_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "assignments_actions_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "assignments_actions" ADD CONSTRAINT "assignments_actions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assignments_actions" ADD CONSTRAINT "assignments_actions_chat_id_fkey" FOREIGN KEY ("chat_id") REFERENCES "assignments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assignments_actions" ADD CONSTRAINT "assignments_actions_action_author_id_fkey" FOREIGN KEY ("action_author_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
