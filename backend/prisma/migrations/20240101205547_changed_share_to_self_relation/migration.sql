/*
  Warnings:

  - You are about to drop the column `share_id` on the `replies` table. All the data in the column will be lost.
  - You are about to drop the `shares` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "medias" DROP CONSTRAINT "medias_shareId_fkey";

-- DropForeignKey
ALTER TABLE "replies" DROP CONSTRAINT "replies_id_fkey";

-- DropForeignKey
ALTER TABLE "replies" DROP CONSTRAINT "replies_share_id_fkey";

-- DropForeignKey
ALTER TABLE "shares" DROP CONSTRAINT "shares_post_id_fkey";

-- DropForeignKey
ALTER TABLE "shares" DROP CONSTRAINT "shares_share_id_fkey";

-- DropForeignKey
ALTER TABLE "shares" DROP CONSTRAINT "shares_user_id_fkey";

-- AlterTable
ALTER TABLE "posts" ADD COLUMN     "is_shared" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "parent_id" TEXT;

-- AlterTable
ALTER TABLE "replies" DROP COLUMN "share_id",
ADD COLUMN     "parent_id" TEXT;

-- DropTable
DROP TABLE "shares";

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "posts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "replies" ADD CONSTRAINT "replies_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "replies"("id") ON DELETE SET NULL ON UPDATE CASCADE;
