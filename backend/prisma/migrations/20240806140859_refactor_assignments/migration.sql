/*
  Warnings:

  - You are about to drop the `assignments_tasks_topics` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `assignments_topics_users` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "assignments_tasks_topics" DROP CONSTRAINT "assignments_tasks_topics_assigned_by_user_id_fkey";

-- DropForeignKey
ALTER TABLE "assignments_tasks_topics" DROP CONSTRAINT "assignments_tasks_topics_assignment_task_id_fkey";

-- DropForeignKey
ALTER TABLE "assignments_topics_users" DROP CONSTRAINT "assignments_topics_users_assignment_task_id_fkey";

-- DropForeignKey
ALTER TABLE "assignments_topics_users" DROP CONSTRAINT "assignments_topics_users_user_id_fkey";

-- DropTable
DROP TABLE "assignments_tasks_topics";

-- DropTable
DROP TABLE "assignments_topics_users";
