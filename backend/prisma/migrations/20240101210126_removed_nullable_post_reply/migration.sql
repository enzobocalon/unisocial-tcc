/*
  Warnings:

  - Made the column `post_id` on table `replies` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "replies" ALTER COLUMN "post_id" SET NOT NULL;
