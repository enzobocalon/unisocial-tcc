-- AlterTable
ALTER TABLE "replies" ALTER COLUMN "content" DROP NOT NULL;

-- AlterTable
ALTER TABLE "shares" ADD COLUMN     "content" TEXT DEFAULT '';
