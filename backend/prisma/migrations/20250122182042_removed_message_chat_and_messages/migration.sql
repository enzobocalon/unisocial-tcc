/*
  Warnings:

  - You are about to drop the column `assignment_id` on the `messages` table. All the data in the column will be lost.
  - You are about to drop the `assignments_actions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `assignments_actions_users` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "assignments_actions" DROP CONSTRAINT "assignments_actions_chat_id_fkey";

-- DropForeignKey
ALTER TABLE "assignments_actions" DROP CONSTRAINT "assignments_actions_task_id_fkey";

-- DropForeignKey
ALTER TABLE "assignments_actions_users" DROP CONSTRAINT "assignments_actions_users_assignments_actions_id_fkey";

-- DropForeignKey
ALTER TABLE "assignments_actions_users" DROP CONSTRAINT "assignments_actions_users_user_id_fkey";

-- DropForeignKey
ALTER TABLE "messages" DROP CONSTRAINT "messages_assignment_id_fkey";

-- AlterTable
ALTER TABLE "messages" DROP COLUMN "assignment_id";

-- DropTable
DROP TABLE "assignments_actions";

-- DropTable
DROP TABLE "assignments_actions_users";
