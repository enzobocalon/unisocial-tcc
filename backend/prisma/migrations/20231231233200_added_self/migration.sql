-- DropForeignKey
ALTER TABLE "shares" DROP CONSTRAINT "shares_post_id_fkey";

-- AlterTable
ALTER TABLE "likes" ADD COLUMN     "share_id" TEXT;

-- AlterTable
ALTER TABLE "medias" ADD COLUMN     "shareId" TEXT;

-- AlterTable
ALTER TABLE "shares" ADD COLUMN     "share_id" TEXT,
ALTER COLUMN "post_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "replies" ADD CONSTRAINT "replies_id_fkey" FOREIGN KEY ("id") REFERENCES "replies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shares" ADD CONSTRAINT "shares_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shares" ADD CONSTRAINT "shares_share_id_fkey" FOREIGN KEY ("share_id") REFERENCES "shares"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medias" ADD CONSTRAINT "medias_shareId_fkey" FOREIGN KEY ("shareId") REFERENCES "shares"("id") ON DELETE SET NULL ON UPDATE CASCADE;
