/*
  Warnings:

  - You are about to drop the column `user_id` on the `assignments_actions` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "assignments_actions" DROP CONSTRAINT "assignments_actions_action_author_id_fkey";

-- DropForeignKey
ALTER TABLE "assignments_actions" DROP CONSTRAINT "assignments_actions_user_id_fkey";

-- AlterTable
ALTER TABLE "assignments_actions" DROP COLUMN "user_id";

-- CreateTable
CREATE TABLE "assignments_actions_users" (
    "id" TEXT NOT NULL,
    "assignments_actions_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "assignments_actions_users_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "assignments_actions_users" ADD CONSTRAINT "assignments_actions_users_assignments_actions_id_fkey" FOREIGN KEY ("assignments_actions_id") REFERENCES "assignments_actions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assignments_actions_users" ADD CONSTRAINT "assignments_actions_users_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
