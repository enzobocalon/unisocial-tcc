/*
  Warnings:

  - A unique constraint covering the columns `[friendship_id]` on the table `notification_objects` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "notification_objects_friendship_id_key" ON "notification_objects"("friendship_id");
