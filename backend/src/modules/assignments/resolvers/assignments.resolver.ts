import { Args, Mutation, Resolver, Subscription, Query } from '@nestjs/graphql';
import { AssignmentsService } from '../services/assignments.service';
import { Assignment } from '../entities/assignment.entity';
import { CreateAssignmentDTO } from '../dto/create-assignment.dto';
import { ActiveUserId } from 'src/shared/decorators/ActiveUserId';
import { ResponseEntity } from 'src/entities/response.entity';
import { CreateRemoveUserAssignmentDTO } from '../dto/create-remove-users-assignment.dto';
import { UpdateUserAssignmentDTO } from '../dto/update-user-assignment.dto';
import { UpdateAssignmentDTO } from '../dto/update-assignment.dto';
import { AssignmentSub } from '../entities/assignment-sub.entity';
import { AssignmentList } from '../entities/assignments-list.entity';
import { AssignmentsUsers } from '../entities/assignment-users.entity';
import { AssignmentFriends } from '../entities/assignment-friends.entity';
import { AssignmentUserSub } from '../entities/assignment-user-sub.entity';

@Resolver()
export class AssignmentsResolver {
  constructor(private readonly assignmentsService: AssignmentsService) {}

  @Mutation(() => Assignment)
  createAssignment(
    @Args('data') data: CreateAssignmentDTO,
    @ActiveUserId() userId: string,
  ) {
    return this.assignmentsService.createAssignment(data, userId);
  }

  @Query(() => ResponseEntity)
  async canNavigateBetweenAssignmentAndChat(
    @ActiveUserId() userId: string,
    @Args('chatId') chatId: string,
    @Args('assignmentId') assignmentId: string,
  ) {
    return this.assignmentsService.canNavigateBetweenAssignmentAndChat(
      userId,
      chatId,
      assignmentId,
    );
  }

  @Mutation(() => ResponseEntity)
  async addUserToAssignment(
    @Args('data') data: CreateRemoveUserAssignmentDTO,
    @ActiveUserId() activeUserId: string,
  ) {
    return this.assignmentsService.addUsersToAssignment(
      data.assignmentId,
      data.usersIds,
      activeUserId,
    );
  }

  // @Query)

  @Mutation(() => ResponseEntity)
  async removeUserFromAssignment(
    @Args('data') data: CreateRemoveUserAssignmentDTO,
    @ActiveUserId() activeUserId: string,
  ) {
    return this.assignmentsService.removeUsersFromAssignment(
      data.assignmentId,
      data.userIdToRemove,
      activeUserId,
    );
  }

  @Mutation(() => ResponseEntity)
  async leaveAssignment(
    @Args('assignmentId') assignmentId: string,
    @ActiveUserId() userId: string,
  ) {
    return this.assignmentsService.leaveAssignment(assignmentId, userId);
  }

  @Mutation(() => ResponseEntity)
  async updateUserRoleInAssignment(
    @Args('data') data: UpdateUserAssignmentDTO,
    @ActiveUserId() userId: string,
  ) {
    return this.assignmentsService.updateUserRoleInAssignment(data, userId);
  }

  @Mutation(() => ResponseEntity)
  async transferAssignmentOwnership(
    @Args('assignmentId') assignmentId: string,
    @Args('userId') userId: string,
    @ActiveUserId() activeUserId: string,
  ) {
    return this.assignmentsService.transferOwnership(
      assignmentId,
      activeUserId,
      userId,
    );
  }

  @Mutation(() => ResponseEntity)
  async deleteAssignment(
    @Args('assignmentId') assignmentId: string,
    @ActiveUserId() userId: string,
  ) {
    return this.assignmentsService.deleteAssignment(assignmentId, userId);
  }

  @Mutation(() => Assignment)
  async updateAssignment(
    @Args('data') data: UpdateAssignmentDTO,
    @ActiveUserId() userId: string,
  ) {
    return this.assignmentsService.updateAssignment(data, userId);
  }

  @Query(() => [AssignmentList])
  async getAssignments(
    @ActiveUserId() userId: string,
    @Args('page') page: number,
  ) {
    return this.assignmentsService.getAssignments(userId, page);
  }

  @Query(() => Assignment)
  async getAssignmentById(
    @Args('assignmentId') assignmentId: string,
    @ActiveUserId() userId: string,
  ) {
    return this.assignmentsService.getAssignmentById(assignmentId, userId);
  }

  @Query(() => [AssignmentsUsers])
  async getAssignmentUsers(
    @Args('assignmentId') assignmentId: string,
    @ActiveUserId() userId: string,
    @Args('page') page: number,
  ) {
    return this.assignmentsService.getAssignmentUsers(
      userId,
      assignmentId,
      page,
    );
  }

  @Query(() => AssignmentFriends)
  async searchAssignmentFriends(
    @Args('assignmentId') assignmentId: string,
    @Args('page') page: number,
    @Args('query') query: string,
    @ActiveUserId() userId: string,
  ) {
    return this.assignmentsService.searchAssignmentAlphabeticalFriends(
      assignmentId,
      userId,
      query,
      page,
    );
  }

  @Query(() => AssignmentFriends)
  async getAssignmentFriends(
    @Args('assignmentId') assignmentId: string,
    @Args('page') page: number,
    @ActiveUserId() userId: string,
  ) {
    return this.assignmentsService.getAssignmentFriends(
      userId,
      assignmentId,
      page,
    );
  }

  @Subscription(() => AssignmentSub)
  async assignments(@ActiveUserId() userId: string) {
    return this.assignmentsService.assignments(userId);
  }

  @Subscription(() => AssignmentUserSub)
  async assignmentMember(
    @Args('assignmentId') assignmentId: string,
    @ActiveUserId() userId: string,
  ) {
    return this.assignmentsService.assignmentMember(assignmentId, userId);
  }
}
