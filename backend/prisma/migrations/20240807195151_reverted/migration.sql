/*
  Warnings:

  - You are about to drop the `assignments_tasks_actions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `assignments_tasks_actions_users` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "assignments_tasks_actions" DROP CONSTRAINT "assignments_tasks_actions_task_id_fkey";

-- DropForeignKey
ALTER TABLE "assignments_tasks_actions" DROP CONSTRAINT "assignments_tasks_actions_user_id_fkey";

-- DropForeignKey
ALTER TABLE "assignments_tasks_actions_users" DROP CONSTRAINT "assignments_tasks_actions_users_assignments_actions_id_fkey";

-- DropForeignKey
ALTER TABLE "assignments_tasks_actions_users" DROP CONSTRAINT "assignments_tasks_actions_users_user_id_fkey";

-- DropTable
DROP TABLE "assignments_tasks_actions";

-- DropTable
DROP TABLE "assignments_tasks_actions_users";

-- DropEnum
DROP TYPE "AssignmentTaskActionEnum";
