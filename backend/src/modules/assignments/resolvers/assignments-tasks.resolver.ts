import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { AssignmentsTasksService } from '../services/assignments-tasks.service';
import { CreateAssignmentTaskDTO } from '../dto/create-assignment-task.dto';
import { ActiveUserId } from 'src/shared/decorators/ActiveUserId';
import { UpdateAssignmentTaskDTO } from '../dto/update-assignment-task.dto';
import { AssignmentTask } from '../entities/assignment-task.entity';
import { TaskSub } from '../entities/task-sub.entity';
import { UploadFileToTaskDTO } from '../dto/upload-file-to-task.dto';
import { ResponseEntity } from 'src/entities/response.entity';
import { UserTaskDTO } from '../dto/users-task.dto';
import { AssignmentList } from '../entities/assignments-list.entity';
import { TaskMember } from '../entities/task-members.entity';
import { TaskAddableUsersResponse } from '../entities/task-addable-users.entity';
import { TaskAllFiles } from '../entities/all-files.entity';

@Resolver()
export class AssignmentsTasksResolver {
  constructor(
    private readonly assignmentTaskService: AssignmentsTasksService,
  ) {}

  @Mutation(() => AssignmentTask)
  createAssignmentTask(
    @Args('data') data: CreateAssignmentTaskDTO,
    @ActiveUserId() userId: string,
  ) {
    return this.assignmentTaskService.createAssignmentTask(data, userId);
  }

  @Mutation(() => ResponseEntity)
  uploadFiles(
    @Args('data') data: UploadFileToTaskDTO,
    @ActiveUserId() userId: string,
  ) {
    return this.assignmentTaskService.uploadFiles(data, userId);
  }

  @Mutation(() => ResponseEntity)
  deleteFile(
    @Args('fileUrl') fileUrl: string,
    @ActiveUserId() userId: string,
    @Args('taskId') taskId: string,
  ) {
    return this.assignmentTaskService.deleteFile(fileUrl, userId, taskId);
  }

  @Mutation(() => AssignmentTask)
  updateAssignmentTask(
    @Args('data') data: UpdateAssignmentTaskDTO,
    @ActiveUserId() userId: string,
  ) {
    return this.assignmentTaskService.updateAssignmentTask(data, userId);
  }

  @Mutation(() => ResponseEntity)
  deleteAssignmentTask(
    @Args('taskId') id: string,
    @ActiveUserId() userId: string,
  ) {
    return this.assignmentTaskService.deleteAssignmentTask(id, userId);
  }

  @Mutation(() => ResponseEntity)
  addUsersToTask(
    @Args('data') data: UserTaskDTO,
    @ActiveUserId() userId: string,
  ) {
    return this.assignmentTaskService.addUsersToTask(data, userId);
  }

  @Mutation(() => ResponseEntity)
  removeUsersFromTask(
    @Args('data') data: UserTaskDTO,
    @ActiveUserId() userId: string,
  ) {
    return this.assignmentTaskService.removeUsersFromTask(data, userId);
  }

  @Query(() => AssignmentTask)
  getTask(@Args('taskId') taskId: string, @ActiveUserId() userId: string) {
    return this.assignmentTaskService.getTask(taskId, userId);
  }

  @Query(() => [AssignmentList])
  getUsersTaskByAssignmentId(
    @Args('page') page: number,
    @Args('assignmentId') assignmentId: string,
    @ActiveUserId() userId: string,
  ) {
    return this.assignmentTaskService.getUsersTaskByAssignmentId(
      assignmentId,
      userId,
      page,
    );
  }

  @Query(() => [TaskAllFiles])
  getAllFilesByTaskId(
    @Args('taskId') taskId: string,
    @ActiveUserId() userId: string,
    @Args('page') page: number,
  ) {
    return this.assignmentTaskService.getAllFiles(taskId, userId, page);
  }

  @Mutation(() => [TaskAllFiles])
  searchFilesByUser(
    @Args('taskId') taskId: string,
    @ActiveUserId() userId: string,
    @Args('query') query: string,
    @Args('page') page: number,
  ) {
    return this.assignmentTaskService.searchFilesByUser(
      taskId,
      userId,
      query,
      page,
    );
  }

  @Query(() => TaskAddableUsersResponse)
  getCategorizedTaskUsers(
    @Args('assignmentId') assignmentId: string,
    @Args('page') page: number,
    @ActiveUserId() userId: string,
  ) {
    return this.assignmentTaskService.getCategorizedTaskUsers(
      assignmentId,
      userId,
      page,
    );
  }

  @Query(() => [AssignmentList])
  getAllTasksByAssignmentId(
    @Args('page') page: number,
    @Args('assignmentId') assignmentId: string,
    @ActiveUserId() userId: string,
  ) {
    return this.assignmentTaskService.getAllTasksByAssignmentId(
      assignmentId,
      userId,
      page,
    );
  }

  @Mutation(() => ResponseEntity)
  tagTaskAsCompleted(
    @Args('taskId') taskId: string,
    @ActiveUserId() userId: string,
  ) {
    return this.assignmentTaskService.tagTaskAsCompleted(taskId, userId);
  }

  @Mutation(() => ResponseEntity)
  leaveTask(@Args('taskId') taskId: string, @ActiveUserId() userId: string) {
    return this.assignmentTaskService.leaveTask(taskId, userId);
  }

  @Query(() => [TaskMember])
  getTaskMembers(
    @Args('page') page: number,
    @Args('taskId') taskId: string,
    @ActiveUserId() userId: string,
  ) {
    return this.assignmentTaskService.getTaskMembers(taskId, page, userId);
  }

  @Query(() => TaskAddableUsersResponse)
  getAddableUsers(
    @Args('assignmentId') assignmentId: string,
    @Args('taskId') taskId: string,
    @ActiveUserId() userId: string,
    @Args('page') page: number,
  ) {
    return this.assignmentTaskService.getAddableTaskUsers(
      assignmentId,
      taskId,
      userId,
      page,
    );
  }

  @Query(() => TaskAddableUsersResponse)
  async searchAddableUsers(
    @Args('assignmentId') assignmentId: string,
    @Args('taskId') taskId: string,
    @ActiveUserId() userId: string,
    @Args('page') page: number,
    @Args('query') query: string,
  ) {
    return this.assignmentTaskService.searchAddableTaskUsers(
      assignmentId,
      taskId,
      userId,
      query,
      page,
    );
  }

  @Subscription(() => TaskSub, {
    resolve: (payload) => {
      return {
        ...payload.tasks,
        task: {
          ...payload.tasks.task,
          createdAt: payload.tasks.task.createdAt
            ? new Date(payload.tasks.task.createdAt)
            : payload.tasks.task.createdAt,
          dueDate: payload.tasks.task.dueDate
            ? new Date(payload.tasks.task.dueDate)
            : null,
        },
      };
    },
  })
  tasks(@ActiveUserId() userId: string) {
    return this.assignmentTaskService.tasks(userId);
  }
}
