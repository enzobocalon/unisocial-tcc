-- AlterTable
ALTER TABLE "medias" ADD COLUMN     "message_id" TEXT;

-- AddForeignKey
ALTER TABLE "medias" ADD CONSTRAINT "medias_message_id_fkey" FOREIGN KEY ("message_id") REFERENCES "messages"("id") ON DELETE CASCADE ON UPDATE CASCADE;
