-- AlterTable
ALTER TABLE "messages" ADD COLUMN     "has_media" BOOLEAN NOT NULL DEFAULT false;

-- AddForeignKey
ALTER TABLE "medias" ADD CONSTRAINT "medias_message_id_fkey" FOREIGN KEY ("message_id") REFERENCES "messages"("id") ON DELETE CASCADE ON UPDATE CASCADE;
