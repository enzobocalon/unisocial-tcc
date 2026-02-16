/*
  Warnings:

  - Added the required column `filename` to the `assignments_tasks_files` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "assignments_tasks_files" ADD COLUMN     "filename" TEXT NOT NULL;
