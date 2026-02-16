/*
  Warnings:

  - You are about to drop the column `mediaId` on the `assignments` table. All the data in the column will be lost.
  - You are about to drop the column `mediaId` on the `chats` table. All the data in the column will be lost.
  - You are about to drop the column `assignmentsTasksTopicsId` on the `medias` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "assignments" DROP CONSTRAINT "assignments_mediaId_fkey";

-- DropForeignKey
ALTER TABLE "chats" DROP CONSTRAINT "chats_mediaId_fkey";

-- DropForeignKey
ALTER TABLE "medias" DROP CONSTRAINT "medias_assignmentsTasksTopicsId_fkey";

-- AlterTable
ALTER TABLE "assignments" DROP COLUMN "mediaId",
ADD COLUMN     "icon" TEXT;

-- AlterTable
ALTER TABLE "assignments_tasks_topics" ADD COLUMN     "files" TEXT[];

-- AlterTable
ALTER TABLE "chats" DROP COLUMN "mediaId",
ADD COLUMN     "icon" TEXT;

-- AlterTable
ALTER TABLE "medias" DROP COLUMN "assignmentsTasksTopicsId";
