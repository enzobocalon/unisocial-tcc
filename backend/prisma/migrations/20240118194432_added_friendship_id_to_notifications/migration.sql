-- DropForeignKey
ALTER TABLE "notifications" DROP CONSTRAINT "notifications_notification_object_id_fkey";

-- AlterTable
ALTER TABLE "notification_objects" ADD COLUMN     "friendship_id" TEXT;

-- AddForeignKey
ALTER TABLE "notification_objects" ADD CONSTRAINT "notification_objects_friendship_id_fkey" FOREIGN KEY ("friendship_id") REFERENCES "friendships"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_notification_object_id_fkey" FOREIGN KEY ("notification_object_id") REFERENCES "notification_objects"("id") ON DELETE CASCADE ON UPDATE CASCADE;
