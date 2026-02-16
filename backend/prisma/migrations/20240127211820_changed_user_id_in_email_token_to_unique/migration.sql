/*
  Warnings:

  - A unique constraint covering the columns `[user_id]` on the table `email_tokens` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "email_tokens_user_id_key" ON "email_tokens"("user_id");
