-- AlterTable
ALTER TABLE "medias" ADD COLUMN     "assignmentsTasksTopicsId" TEXT;

-- AlterTable
ALTER TABLE "messages" ADD COLUMN     "assignment_id" TEXT;

-- CreateTable
CREATE TABLE "assignments" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "owner_id" TEXT NOT NULL,

    CONSTRAINT "assignments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assignments_users" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "assignment_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "assignmentsTasksTopicsId" TEXT,

    CONSTRAINT "assignments_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assignments_tasks" (
    "id" TEXT NOT NULL,
    "assignment_id" TEXT NOT NULL,
    "owner_id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "assignments_tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assignments_tasks_topics" (
    "id" TEXT NOT NULL,
    "assignment_task_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "assigned_by_user_id" TEXT NOT NULL,

    CONSTRAINT "assignments_tasks_topics_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "assignments" ADD CONSTRAINT "assignments_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assignments_users" ADD CONSTRAINT "assignments_users_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assignments_users" ADD CONSTRAINT "assignments_users_assignment_id_fkey" FOREIGN KEY ("assignment_id") REFERENCES "assignments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assignments_users" ADD CONSTRAINT "assignments_users_assignmentsTasksTopicsId_fkey" FOREIGN KEY ("assignmentsTasksTopicsId") REFERENCES "assignments_tasks_topics"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assignments_tasks_topics" ADD CONSTRAINT "assignments_tasks_topics_assignment_task_id_fkey" FOREIGN KEY ("assignment_task_id") REFERENCES "assignments_tasks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assignments_tasks_topics" ADD CONSTRAINT "assignments_tasks_topics_assigned_by_user_id_fkey" FOREIGN KEY ("assigned_by_user_id") REFERENCES "assignments_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_assignment_id_fkey" FOREIGN KEY ("assignment_id") REFERENCES "assignments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medias" ADD CONSTRAINT "medias_assignmentsTasksTopicsId_fkey" FOREIGN KEY ("assignmentsTasksTopicsId") REFERENCES "assignments_tasks_topics"("id") ON DELETE SET NULL ON UPDATE CASCADE;
