/*
  Warnings:

  - You are about to drop the column `actor_id` on the `notification_objects` table. All the data in the column will be lost.
  - You are about to drop the column `notifier_id` on the `notifications` table. All the data in the column will be lost.
  - Added the required column `emitter` to the `notification_objects` table without a default value. This is not possible if the table is not empty.
  - Added the required column `receiver_id` to the `notifications` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "notification_objects" DROP CONSTRAINT "notification_objects_actor_id_fkey";

-- DropForeignKey
ALTER TABLE "notifications" DROP CONSTRAINT "notifications_notifier_id_fkey";

-- AlterTable
ALTER TABLE "notification_objects" DROP COLUMN "actor_id",
ADD COLUMN     "emitter" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "notifications" DROP COLUMN "notifier_id",
ADD COLUMN     "receiver_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "notification_objects" ADD CONSTRAINT "notification_objects_emitter_fkey" FOREIGN KEY ("emitter") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_receiver_id_fkey" FOREIGN KEY ("receiver_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
