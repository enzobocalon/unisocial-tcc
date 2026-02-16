/*
  Warnings:

  - The values [DELETE] on the enum `MessageStatusEnum` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "MessageStatusEnum_new" AS ENUM ('READ', 'UNREAD');
ALTER TABLE "message_status" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "message_status" ALTER COLUMN "status" TYPE "MessageStatusEnum_new" USING ("status"::text::"MessageStatusEnum_new");
ALTER TYPE "MessageStatusEnum" RENAME TO "MessageStatusEnum_old";
ALTER TYPE "MessageStatusEnum_new" RENAME TO "MessageStatusEnum";
DROP TYPE "MessageStatusEnum_old";
ALTER TABLE "message_status" ALTER COLUMN "status" SET DEFAULT 'UNREAD';
COMMIT;
