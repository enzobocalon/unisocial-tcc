/*
  Warnings:

  - You are about to drop the column `dueDate` on the `assignments_tasks` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "assignments_tasks" DROP COLUMN "dueDate",
ADD COLUMN     "due_date" TIMESTAMP(3);
