-- AlterTable
ALTER TABLE "notification_objects" ADD COLUMN     "assignment_id" TEXT;

-- AddForeignKey
ALTER TABLE "notification_objects" ADD CONSTRAINT "notification_objects_assignment_id_fkey" FOREIGN KEY ("assignment_id") REFERENCES "assignments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
