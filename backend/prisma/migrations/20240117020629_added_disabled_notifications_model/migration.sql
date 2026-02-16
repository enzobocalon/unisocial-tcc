-- CreateTable
CREATE TABLE "disabled_notifications" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "post_id" TEXT NOT NULL,

    CONSTRAINT "disabled_notifications_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "disabled_notifications" ADD CONSTRAINT "disabled_notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "disabled_notifications" ADD CONSTRAINT "disabled_notifications_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
