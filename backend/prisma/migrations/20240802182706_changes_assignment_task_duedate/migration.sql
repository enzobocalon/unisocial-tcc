/*
  Warnings:

  - You are about to drop the column `endDate` on the `assignments_tasks` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "assignments_tasks" DROP COLUMN "endDate",
ADD COLUMN     "dueDate" TIMESTAMP(3);
