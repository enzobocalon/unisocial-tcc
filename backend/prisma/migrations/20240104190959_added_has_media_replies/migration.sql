/*
  Warnings:

  - You are about to drop the column `share_id` on the `likes` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "likes" DROP COLUMN "share_id";

-- AlterTable
ALTER TABLE "replies" ADD COLUMN     "has_media" BOOLEAN NOT NULL DEFAULT false;
