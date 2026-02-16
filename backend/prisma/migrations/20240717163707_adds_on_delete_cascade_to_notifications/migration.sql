-- DropForeignKey
ALTER TABLE "notification_objects" DROP CONSTRAINT "notification_objects_emitter_fkey";

-- DropForeignKey
ALTER TABLE "notification_objects" DROP CONSTRAINT "notification_objects_friendship_id_fkey";

-- DropForeignKey
ALTER TABLE "notification_objects" DROP CONSTRAINT "notification_objects_post_id_fkey";

-- DropForeignKey
ALTER TABLE "notification_objects" DROP CONSTRAINT "notification_objects_reply_id_fkey";

-- DropForeignKey
ALTER TABLE "notification_objects" DROP CONSTRAINT "notification_objects_type_id_fkey";

-- AddForeignKey
ALTER TABLE "notification_objects" ADD CONSTRAINT "notification_objects_type_id_fkey" FOREIGN KEY ("type_id") REFERENCES "notification_types"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification_objects" ADD CONSTRAINT "notification_objects_emitter_fkey" FOREIGN KEY ("emitter") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification_objects" ADD CONSTRAINT "notification_objects_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification_objects" ADD CONSTRAINT "notification_objects_reply_id_fkey" FOREIGN KEY ("reply_id") REFERENCES "replies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification_objects" ADD CONSTRAINT "notification_objects_friendship_id_fkey" FOREIGN KEY ("friendship_id") REFERENCES "friendships"("id") ON DELETE CASCADE ON UPDATE CASCADE;
