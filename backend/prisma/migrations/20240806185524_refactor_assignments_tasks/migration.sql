-- DropForeignKey
ALTER TABLE "assignments_tasks" DROP CONSTRAINT "assignments_tasks_owner_id_fkey";

-- CreateTable
CREATE TABLE "assignments_tasks_users" (
    "id" TEXT NOT NULL,
    "task_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "assignments_tasks_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assignments_tasks_files" (
    "id" TEXT NOT NULL,
    "task_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "assignments_tasks_files_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "assignments_tasks" ADD CONSTRAINT "assignments_tasks_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assignments_tasks_users" ADD CONSTRAINT "assignments_tasks_users_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "assignments_tasks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assignments_tasks_users" ADD CONSTRAINT "assignments_tasks_users_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assignments_tasks_files" ADD CONSTRAINT "assignments_tasks_files_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "assignments_tasks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assignments_tasks_files" ADD CONSTRAINT "assignments_tasks_files_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
