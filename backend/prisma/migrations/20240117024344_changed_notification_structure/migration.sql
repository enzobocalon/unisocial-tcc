/*
  Warnings:

  - You are about to drop the column `action` on the `notification_objects` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "notification_objects" DROP COLUMN "action",
ADD COLUMN     "post_id" TEXT,
ADD COLUMN     "reply_id" TEXT;

-- AddForeignKey
ALTER TABLE "notification_objects" ADD CONSTRAINT "notification_objects_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification_objects" ADD CONSTRAINT "notification_objects_reply_id_fkey" FOREIGN KEY ("reply_id") REFERENCES "replies"("id") ON DELETE SET NULL ON UPDATE CASCADE;
