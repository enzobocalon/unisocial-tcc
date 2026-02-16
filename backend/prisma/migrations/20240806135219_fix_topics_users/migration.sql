/*
  Warnings:

  - You are about to drop the column `assignmentsTasksTopicsId` on the `assignments_users` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "assignments_users" DROP CONSTRAINT "assignments_users_assignmentsTasksTopicsId_fkey";

-- AlterTable
ALTER TABLE "assignments_users" DROP COLUMN "assignmentsTasksTopicsId";

-- CreateTable
CREATE TABLE "assignments_topics_users" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "assignment_task_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "assignments_topics_users_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "assignments_topics_users" ADD CONSTRAINT "assignments_topics_users_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "assignments_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assignments_topics_users" ADD CONSTRAINT "assignments_topics_users_assignment_task_id_fkey" FOREIGN KEY ("assignment_task_id") REFERENCES "assignments_tasks"("id") ON DELETE CASCADE ON UPDATE CASCADE;
