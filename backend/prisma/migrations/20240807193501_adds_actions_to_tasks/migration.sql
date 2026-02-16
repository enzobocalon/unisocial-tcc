-- CreateEnum
CREATE TYPE "AssignmentTaskActionEnum" AS ENUM ('UPLOAD_FILE', 'REMOVE_FILE', 'UPDATE', 'CHANGE_OWNERSHIP', 'ADD_USER', 'REMOVE_USER');

-- CreateTable
CREATE TABLE "assignments_tasks_actions" (
    "id" TEXT NOT NULL,
    "task_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "action" "AssignmentTaskActionEnum" NOT NULL,
    "message" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "assignments_tasks_actions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assignments_tasks_actions_users" (
    "id" TEXT NOT NULL,
    "assignments_actions_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "assignments_tasks_actions_users_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "assignments_tasks_actions" ADD CONSTRAINT "assignments_tasks_actions_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "assignments_tasks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assignments_tasks_actions" ADD CONSTRAINT "assignments_tasks_actions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "assignments_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assignments_tasks_actions_users" ADD CONSTRAINT "assignments_tasks_actions_users_assignments_actions_id_fkey" FOREIGN KEY ("assignments_actions_id") REFERENCES "assignments_tasks_actions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assignments_tasks_actions_users" ADD CONSTRAINT "assignments_tasks_actions_users_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
