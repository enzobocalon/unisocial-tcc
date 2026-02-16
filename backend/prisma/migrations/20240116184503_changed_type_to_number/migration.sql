/*
  Warnings:

  - The primary key for the `notification_types` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `notification_types` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `type_id` on the `notification_objects` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "notification_objects" DROP CONSTRAINT "notification_objects_type_id_fkey";

-- AlterTable
ALTER TABLE "notification_objects" DROP COLUMN "type_id",
ADD COLUMN     "type_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "notification_types" DROP CONSTRAINT "notification_types_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "notification_types_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "notification_objects" ADD CONSTRAINT "notification_objects_type_id_fkey" FOREIGN KEY ("type_id") REFERENCES "notification_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
