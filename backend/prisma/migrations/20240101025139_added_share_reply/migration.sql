-- DropForeignKey
ALTER TABLE "replies" DROP CONSTRAINT "replies_post_id_fkey";

-- AlterTable
ALTER TABLE "replies" ADD COLUMN     "share_id" TEXT,
ALTER COLUMN "post_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "replies" ADD CONSTRAINT "replies_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "replies" ADD CONSTRAINT "replies_share_id_fkey" FOREIGN KEY ("share_id") REFERENCES "shares"("id") ON DELETE SET NULL ON UPDATE CASCADE;
