/*
  Warnings:

  - You are about to drop the column `icon` on the `assignments` table. All the data in the column will be lost.
  - You are about to drop the column `avatar` on the `chats` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "assignments" DROP COLUMN "icon",
ADD COLUMN     "mediaId" TEXT;

-- AlterTable
ALTER TABLE "chats" DROP COLUMN "avatar",
ADD COLUMN     "mediaId" TEXT;

-- AddForeignKey
ALTER TABLE "chats" ADD CONSTRAINT "chats_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "medias"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assignments" ADD CONSTRAINT "assignments_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "medias"("id") ON DELETE SET NULL ON UPDATE CASCADE;
