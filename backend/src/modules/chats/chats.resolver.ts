import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { ChatsService } from './services/chats.service';
import { Chat } from './entities/chat.entity';
import { ActiveUserId } from 'src/shared/decorators/ActiveUserId';
import { CreateChatDTO } from './dto/create-chat.dto';
import { Message } from './entities/message.entity';
import { CreateMessageDTO } from './dto/create-message.dto';
import { MessageService } from './services/message.service';
import { ChatMessageSub } from './entities/chat-sub.entity';
import { AddUserDTO } from './dto/add-user.dto';
import { RemoveUserDTO } from './dto/remove-user.dto';
import { UpdateChatDTO } from './dto/update-chat.dto';
import { ResponseEntity } from 'src/entities/response.entity';
import { UpdateChatUserDTO } from './dto/update-user.dto';
import { ChatActionEntity } from './entities/chat-action.entity';
import { ChatContent } from './entities/content.entity';
import MessageUpdateStatus from './entities/message-update-status.entity';
import { ChatMember } from './entities/chat-members.entity';
import { ChatFriends } from './entities/friends-chat.entity';

@Resolver()
export class ChatsResolver {
  constructor(
    private readonly chatsService: ChatsService,
    private readonly messageService: MessageService,
  ) {}

  @Mutation(() => Chat)
  createChat(
    @ActiveUserId() userId: string,
    @Args('data') data: CreateChatDTO,
  ) {
    return this.chatsService.create(userId, data);
  }

  @Mutation(() => Message)
  sendMessage(
    @ActiveUserId() userId: string,
    @Args('data') data: CreateMessageDTO,
  ) {
    return this.messageService.sendMessage(userId, data);
  }

  @Mutation(() => Chat)
  addUserToChat(
    @ActiveUserId() userId: string,
    @Args('data') data: AddUserDTO,
  ) {
    return this.chatsService.addUserToChat(userId, data);
  }

  @Mutation(() => Chat)
  joinChat(@ActiveUserId() userId: string, @Args('chatId') chatId: string) {
    return this.chatsService.joinChat(userId, chatId);
  }

  @Mutation(() => Chat)
  removeUserFromChat(
    @ActiveUserId() userId: string,
    @Args('data') data: RemoveUserDTO,
  ) {
    return this.chatsService.removeUserFromChat(userId, data);
  }

  @Mutation(() => ChatFriends)
  searchChatFriends(
    @ActiveUserId() userId: string,
    @Args('chatId') chatId: string,
    @Args('query') query: string,
    @Args('page') page: number,
  ) {
    return this.chatsService.searchChatFriends(userId, chatId, page, query);
  }

  @Mutation(() => ResponseEntity)
  deleteMessage(
    @ActiveUserId() userId: string,
    @Args('messageId') messageId: string,
    @Args('chatId') chatId: string,
  ) {
    return this.messageService.deleteMessage(userId, messageId, chatId);
  }

  @Mutation(() => Chat)
  leaveChat(@ActiveUserId() userId: string, @Args('data') data: RemoveUserDTO) {
    return this.chatsService.leaveChat(userId, data);
  }

  @Mutation(() => ResponseEntity)
  updateMessagesStatus(
    @ActiveUserId() userId: string,
    @Args('chatId') chatId: string,
  ) {
    return this.messageService.updateChatMessagesStatus(userId, chatId);
  }

  // Query

  @Query(() => [ChatMessageSub])
  getAllChats(@ActiveUserId() userId: string, @Args('page') page: number) {
    return this.chatsService.getAllChats(userId, page);
  }

  @Query(() => [ChatMember])
  getChatMembers(
    @Args('chatId') chatId: string,
    @ActiveUserId() userId: string,
    @Args('page') page: number,
  ) {
    return this.chatsService.getChatMembers(userId, chatId, page);
  }

  @Query(() => Chat)
  getChatByUserMember(
    @Args('userId') id: string,
    @ActiveUserId() userId: string,
  ) {
    return this.chatsService.getChatByUserMember(id, userId);
  }

  @Query(() => Chat)
  getChatById(@Args('chatId') chatId: string, @ActiveUserId() userId: string) {
    return this.chatsService.getChatById(userId, chatId);
  }

  @Mutation(() => ResponseEntity)
  linkChatToAssignment(
    @Args('chatId') chatId: string,
    @Args('assignmentId') assignmentId: string,
    @ActiveUserId() userId: string,
  ) {
    return this.chatsService.linkChatToAssignment(chatId, assignmentId, userId);
  }

  @Mutation(() => ResponseEntity)
  unlinkChatAndAssignment(
    @Args('chatId') chatId: string,
    @Args('assignmentId') assignmentId: string,
    @ActiveUserId() userId: string,
  ) {
    return this.chatsService.unlinkChatAndAssignment(
      chatId,
      assignmentId,
      userId,
    );
  }

  @Query(() => [ChatContent])
  getChatMessages(
    @ActiveUserId() userId: string,
    @Args('page') page: number,
    @Args('chatId') chatId: string,
  ) {
    return this.messageService.getChatContent(userId, chatId, page);
  }

  @Query(() => [ChatActionEntity])
  getChatActions(
    @ActiveUserId() userId: string,
    @Args('chatId') chatId: string,
    @Args('page') page: number,
  ) {
    return this.chatsService.getChatActions(userId, chatId, page);
  }

  @Query(() => [Chat])
  getLinkableChats(
    @Args('assignmentId') assignmentId: string,
    @ActiveUserId() userId: string,
    @Args('page') page: number,
  ) {
    return this.chatsService.getLinkableChats(assignmentId, userId, page);
  }

  @Query(() => ChatFriends)
  getChatFriends(
    @ActiveUserId() userId: string,
    @Args('chatId') chatId: string,
    @Args('page') page: number,
  ) {
    return this.chatsService.getChatFriends(userId, chatId, page);
  }

  // Chat settings
  @Mutation(() => Chat)
  transferOwnership(
    @ActiveUserId() currentOwner: string,
    @Args('userId') userId: string,
    @Args('chatId') chatId: string,
  ) {
    return this.chatsService.transferOwnership(currentOwner, userId, chatId);
  }

  @Mutation(() => Chat)
  updateChatSettings(
    @ActiveUserId() userId: string,
    @Args('data') data: UpdateChatDTO,
  ) {
    return this.chatsService.updateChatSettings(userId, data);
  }

  @Mutation(() => ResponseEntity)
  changeUserRole(
    @ActiveUserId() userId: string,
    @Args('data') data: UpdateChatUserDTO,
  ) {
    return this.chatsService.changeUserRole(userId, data);
  }

  @Subscription(() => ChatMessageSub)
  chats(@ActiveUserId() userId: string) {
    return this.chatsService.chat(userId);
  }

  @Subscription(() => ChatMessageSub)
  activeChat(@Args('chatId') chatId: string, @ActiveUserId() userId: string) {
    return this.chatsService.activeChat(chatId, userId);
  }

  @Subscription(() => ChatMessageSub)
  message(
    @Args('messageId') messageId: string,
    @ActiveUserId() userId: string,
  ) {
    return this.messageService.message(messageId, userId);
  }

  @Subscription(() => MessageUpdateStatus)
  messageStatus(@ActiveUserId() userId: string) {
    return this.messageService.messageStatus(userId);
  }
}
