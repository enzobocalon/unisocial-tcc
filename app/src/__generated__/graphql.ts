/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format. */
  DateTime: { input: any; output: any; }
  /** The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSON: { input: any; output: any; }
};

export type Actions = {
  __typename?: 'Actions';
  author?: Maybe<BaseUser>;
  createdAt: Scalars['DateTime']['output'];
  id?: Maybe<Scalars['String']['output']>;
  type: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type AddUserDto = {
  chatId: Scalars['String']['input'];
  userToAddId?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type AlphabeticalFriendsResponse = {
  __typename?: 'AlphabeticalFriendsResponse';
  data: Scalars['JSON']['output'];
  hasNextPage: Scalars['Boolean']['output'];
};

export type Assignment = {
  __typename?: 'Assignment';
  chatId?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['String']['output'];
  icon?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  isAdmin?: Maybe<Scalars['Boolean']['output']>;
  media?: Maybe<Media>;
  name: Scalars['String']['output'];
  ownerId: Scalars['String']['output'];
  users?: Maybe<Array<BaseUser>>;
};

export type AssignmentFriend = {
  __typename?: 'AssignmentFriend';
  friends: Array<BaseUserExtended>;
  letter: Scalars['String']['output'];
};

export type AssignmentFriends = {
  __typename?: 'AssignmentFriends';
  count: Scalars['Int']['output'];
  data: Array<AssignmentFriend>;
  hasNextPage: Scalars['Boolean']['output'];
};

export type AssignmentList = {
  __typename?: 'AssignmentList';
  dueDate: Scalars['DateTime']['output'];
  item: Array<AssignmentListItem>;
};

export type AssignmentListItem = {
  __typename?: 'AssignmentListItem';
  description?: Maybe<Scalars['String']['output']>;
  dueDate: Scalars['String']['output'];
  icon?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  isPending: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  pendingCount?: Maybe<Scalars['Int']['output']>;
};

export type AssignmentSub = {
  __typename?: 'AssignmentSub';
  action?: Maybe<Scalars['String']['output']>;
  assignment: Assignment;
  member?: Maybe<AssignmentsUsers>;
};

export type AssignmentTask = {
  __typename?: 'AssignmentTask';
  assignmentId: Scalars['String']['output'];
  completed: Scalars['Boolean']['output'];
  completedCount: Scalars['Int']['output'];
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  dueDate?: Maybe<Scalars['DateTime']['output']>;
  files: Array<TaskFiles>;
  id: Scalars['String']['output'];
  isMember: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  owner: BaseUser;
  ownerId: Scalars['String']['output'];
  totalCount: Scalars['Int']['output'];
};

export type AssignmentUserSub = {
  __typename?: 'AssignmentUserSub';
  action?: Maybe<Scalars['String']['output']>;
  assignment: Assignment;
  member?: Maybe<AssignmentsUsers>;
};

export type AssignmentsUsers = {
  __typename?: 'AssignmentsUsers';
  assignment?: Maybe<Assignment>;
  assignmentId: Scalars['String']['output'];
  id: Scalars['String']['output'];
  isAdmin: Scalars['Boolean']['output'];
  user: BaseUser;
  userId: Scalars['String']['output'];
};

export type BaseUser = {
  __typename?: 'BaseUser';
  avatar?: Maybe<Scalars['String']['output']>;
  banner?: Maybe<Scalars['String']['output']>;
  bio?: Maybe<Scalars['String']['output']>;
  course?: Maybe<Course>;
  courseId?: Maybe<Scalars['String']['output']>;
  friendsCount?: Maybe<Scalars['Float']['output']>;
  friendship?: Maybe<Friendship>;
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
  username: Scalars['String']['output'];
};

export type BaseUserExtended = {
  __typename?: 'BaseUserExtended';
  avatar?: Maybe<Scalars['String']['output']>;
  banner?: Maybe<Scalars['String']['output']>;
  bio?: Maybe<Scalars['String']['output']>;
  course?: Maybe<Course>;
  courseId?: Maybe<Scalars['String']['output']>;
  friendsCount?: Maybe<Scalars['Float']['output']>;
  friendship?: Maybe<Friendship>;
  id: Scalars['String']['output'];
  isMember: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  username: Scalars['String']['output'];
};

export type Chat = {
  __typename?: 'Chat';
  createdAt: Scalars['String']['output'];
  directUserMember?: Maybe<Scalars['String']['output']>;
  icon?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  isAdmin?: Maybe<Scalars['Boolean']['output']>;
  isDirect: Scalars['Boolean']['output'];
  isOnline?: Maybe<Scalars['Boolean']['output']>;
  name: Scalars['String']['output'];
  ownerId?: Maybe<Scalars['String']['output']>;
  type: ChatType;
  unreadMessages?: Maybe<Scalars['Int']['output']>;
};

export type ChatActionEntity = {
  __typename?: 'ChatActionEntity';
  action: Scalars['String']['output'];
  actionAuthor: BaseUser;
  actionType?: Maybe<ChatActionEnum>;
  chatId: Scalars['String']['output'];
  createdAt: Scalars['String']['output'];
  id: Scalars['String']['output'];
  message?: Maybe<Scalars['String']['output']>;
  user?: Maybe<CustomChatBaseUser>;
};

export enum ChatActionEnum {
  Add = 'ADD',
  AssignmentLink = 'ASSIGNMENT_LINK',
  AssignmentUnlink = 'ASSIGNMENT_UNLINK',
  ChatUpdate = 'CHAT_UPDATE',
  Create = 'CREATE',
  Delete = 'DELETE',
  Join = 'JOIN',
  Leave = 'LEAVE',
  Remove = 'REMOVE',
  UserRoleUpdate = 'USER_ROLE_UPDATE'
}

export type ChatContent = {
  __typename?: 'ChatContent';
  action?: Maybe<ContentAction>;
  author: BaseUser;
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['String']['output'];
  message?: Maybe<ContentMessage>;
  system: Scalars['Boolean']['output'];
};

export type ChatFriend = {
  __typename?: 'ChatFriend';
  friends: Array<BaseUserExtended>;
  letter: Scalars['String']['output'];
};

export type ChatFriends = {
  __typename?: 'ChatFriends';
  count: Scalars['Int']['output'];
  data: Array<ChatFriend>;
  hasNextPage: Scalars['Boolean']['output'];
};

export type ChatMember = {
  __typename?: 'ChatMember';
  id: Scalars['String']['output'];
  isAdmin: Scalars['Boolean']['output'];
  user: BaseUser;
};

export type ChatMessageSub = {
  __typename?: 'ChatMessageSub';
  chat: Chat;
  chatAction?: Maybe<ChatActionEntity>;
  message?: Maybe<Message>;
};

export enum ChatType {
  Private = 'PRIVATE',
  Public = 'PUBLIC'
}

export type ContentAction = {
  __typename?: 'ContentAction';
  action: Scalars['String']['output'];
  message?: Maybe<Scalars['String']['output']>;
  user: BaseUser;
};

export type ContentMedia = {
  __typename?: 'ContentMedia';
  urls?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
};

export type ContentMessage = {
  __typename?: 'ContentMessage';
  content: Scalars['String']['output'];
  hasMedia: Scalars['Boolean']['output'];
  media?: Maybe<ContentMedia>;
};

export type Course = {
  __typename?: 'Course';
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
};

export type CreateAssignmentDto = {
  icon?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  usersIds?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type CreateAssignmentTaskDto = {
  assignmentId: Scalars['String']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  dueDate?: InputMaybe<Scalars['DateTime']['input']>;
  name: Scalars['String']['input'];
  users?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type CreateChatDto = {
  icon?: InputMaybe<Scalars['String']['input']>;
  isDirect: Scalars['Boolean']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  type: ChatType;
  users?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type CreateFriendshipDto = {
  friendId: Scalars['String']['input'];
};

export type CreateMessageDto = {
  assignmentId?: InputMaybe<Scalars['String']['input']>;
  chatId?: InputMaybe<Scalars['String']['input']>;
  content?: InputMaybe<Scalars['String']['input']>;
  medias?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type CreatePostDto = {
  content?: InputMaybe<Scalars['String']['input']>;
  medias?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type CreateRemoveUserAssignmentDto = {
  assignmentId: Scalars['String']['input'];
  userIdToRemove?: InputMaybe<Scalars['String']['input']>;
  usersIds?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type CreateReplyDto = {
  content?: InputMaybe<Scalars['String']['input']>;
  medias?: InputMaybe<Array<Scalars['String']['input']>>;
  parentId?: InputMaybe<Scalars['String']['input']>;
  postId: Scalars['String']['input'];
};

export type CreateShareDto = {
  content?: InputMaybe<Scalars['String']['input']>;
  medias?: InputMaybe<Array<Scalars['String']['input']>>;
  parentId: Scalars['String']['input'];
};

export type CustomChatBaseUser = {
  __typename?: 'CustomChatBaseUser';
  avatar?: Maybe<Scalars['String']['output']>;
  banner?: Maybe<Scalars['String']['output']>;
  bio?: Maybe<Scalars['String']['output']>;
  course?: Maybe<Course>;
  courseId?: Maybe<Scalars['String']['output']>;
  friendsCount?: Maybe<Scalars['Float']['output']>;
  friendship?: Maybe<Friendship>;
  id: Scalars['String']['output'];
  isAdmin?: Maybe<Scalars['Boolean']['output']>;
  name: Scalars['String']['output'];
  username: Scalars['String']['output'];
};

export type FileUser = {
  __typename?: 'FileUser';
  id: Scalars['String']['output'];
  user: BaseUser;
};

export type Friendship = {
  __typename?: 'Friendship';
  friendId: Scalars['String']['output'];
  id: Scalars['String']['output'];
  status: FriendshipStatusEnum;
  userId: Scalars['String']['output'];
};

export enum FriendshipStatusEnum {
  Accepted = 'ACCEPTED',
  Blocked = 'BLOCKED',
  None = 'NONE',
  Received = 'RECEIVED',
  Sent = 'SENT'
}

export type LikeWithCount = {
  __typename?: 'LikeWithCount';
  count: Scalars['Int']['output'];
  like: Array<BaseUser>;
};

export type Media = {
  __typename?: 'Media';
  id: Scalars['String']['output'];
  messageId?: Maybe<Scalars['String']['output']>;
  postId?: Maybe<Scalars['String']['output']>;
  replyId?: Maybe<Scalars['String']['output']>;
  shareId?: Maybe<Scalars['String']['output']>;
  url: Scalars['String']['output'];
};

/** Origem da mídia */
export enum MediaSource {
  Default = 'DEFAULT',
  Doc = 'DOC',
  ImageOnly = 'IMAGE_ONLY'
}

export type Mention = {
  __typename?: 'Mention';
  user: BaseUser;
};

export type Message = {
  __typename?: 'Message';
  content: Scalars['String']['output'];
  createdAt: Scalars['String']['output'];
  deletedAt?: Maybe<Scalars['String']['output']>;
  hasMedia: Scalars['Boolean']['output'];
  id: Scalars['String']['output'];
  media?: Maybe<Array<Media>>;
  messageStatus?: Maybe<Array<MessageStatus>>;
  user: BaseUser;
};

export type MessageStatus = {
  __typename?: 'MessageStatus';
  messageId: Scalars['String']['output'];
  status: MessageStatusEnum;
  user: BaseUser;
  userId: Scalars['String']['output'];
};

export enum MessageStatusEnum {
  Read = 'READ',
  Unread = 'UNREAD'
}

export type MessageUpdateStatus = {
  __typename?: 'MessageUpdateStatus';
  chatId: Scalars['String']['output'];
  id: Scalars['String']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  /** Accept a friendship */
  acceptFriendship: ResponseEntity;
  addUserToAssignment: ResponseEntity;
  addUserToChat: Chat;
  addUsersToTask: ResponseEntity;
  changeUserRole: ResponseEntity;
  createAssignment: Assignment;
  createAssignmentTask: AssignmentTask;
  createChat: Chat;
  /** Create a new friendship */
  createFriendship: ResponseEntity;
  /** Create a new post */
  createPost: Post;
  /** Create a reply */
  createReply: Reply;
  deleteAssignment: ResponseEntity;
  deleteAssignmentTask: ResponseEntity;
  deleteFile: ResponseEntity;
  /** Delete a friendship */
  deleteFriendship: ResponseEntity;
  deleteMessage: ResponseEntity;
  /** Delete a reply */
  deleteReply: ResponseEntity;
  /** Disable notifications from a post */
  disableNotifications: ResponseEntity;
  /** Enable notifications from a post */
  enableNotifications: ResponseEntity;
  generatePresignedUrls: Array<PresignedUrl>;
  invalidateTracking: Tracking;
  joinChat: Chat;
  leaveAssignment: ResponseEntity;
  leaveChat: Chat;
  leaveTask: ResponseEntity;
  /** Like a post */
  likePost: ResponseEntity;
  linkChatToAssignment: ResponseEntity;
  removePost: Post;
  removeUserFromAssignment: ResponseEntity;
  removeUserFromChat: Chat;
  removeUsersFromTask: ResponseEntity;
  searchChatFriends: ChatFriends;
  searchFilesByUser: Array<TaskAllFiles>;
  /** Search friends by name from active user sorted by alphabetical order */
  searchFriendsAlphabetically: AlphabeticalFriendsResponse;
  sendMessage: Message;
  sendTrackingData: Tracking;
  share: Post;
  /** Returns a JWT Token */
  signin: Token;
  /** Create a new user and returns a JWT */
  signup: ResponseEntity;
  tagTaskAsCompleted: ResponseEntity;
  transferAssignmentOwnership: ResponseEntity;
  transferOwnership: Chat;
  /** Unlike a post */
  unlikePost: ResponseEntity;
  unlinkChatAndAssignment: ResponseEntity;
  unshare: ResponseEntity;
  updateAssignment: Assignment;
  updateAssignmentTask: AssignmentTask;
  updateChatSettings: Chat;
  updateMessagesStatus: ResponseEntity;
  /** Update a post */
  updatePost: Post;
  updateProfile: BaseUser;
  /** Update a reply */
  updateReply: Reply;
  updateUser: BaseUser;
  updateUserRoleInAssignment: ResponseEntity;
  uploadFiles: ResponseEntity;
};


export type MutationAcceptFriendshipArgs = {
  id: Scalars['String']['input'];
};


export type MutationAddUserToAssignmentArgs = {
  data: CreateRemoveUserAssignmentDto;
};


export type MutationAddUserToChatArgs = {
  data: AddUserDto;
};


export type MutationAddUsersToTaskArgs = {
  data: UserTaskDto;
};


export type MutationChangeUserRoleArgs = {
  data: UpdateChatUserDto;
};


export type MutationCreateAssignmentArgs = {
  data: CreateAssignmentDto;
};


export type MutationCreateAssignmentTaskArgs = {
  data: CreateAssignmentTaskDto;
};


export type MutationCreateChatArgs = {
  data: CreateChatDto;
};


export type MutationCreateFriendshipArgs = {
  data: CreateFriendshipDto;
};


export type MutationCreatePostArgs = {
  data: CreatePostDto;
};


export type MutationCreateReplyArgs = {
  data: CreateReplyDto;
};


export type MutationDeleteAssignmentArgs = {
  assignmentId: Scalars['String']['input'];
};


export type MutationDeleteAssignmentTaskArgs = {
  taskId: Scalars['String']['input'];
};


export type MutationDeleteFileArgs = {
  fileUrl: Scalars['String']['input'];
  taskId: Scalars['String']['input'];
};


export type MutationDeleteFriendshipArgs = {
  id: Scalars['String']['input'];
};


export type MutationDeleteMessageArgs = {
  chatId: Scalars['String']['input'];
  messageId: Scalars['String']['input'];
};


export type MutationDeleteReplyArgs = {
  id: Scalars['String']['input'];
};


export type MutationDisableNotificationsArgs = {
  postId: Scalars['String']['input'];
};


export type MutationEnableNotificationsArgs = {
  postId: Scalars['String']['input'];
};


export type MutationGeneratePresignedUrlsArgs = {
  data: Array<UrlRequestDto>;
};


export type MutationJoinChatArgs = {
  chatId: Scalars['String']['input'];
};


export type MutationLeaveAssignmentArgs = {
  assignmentId: Scalars['String']['input'];
};


export type MutationLeaveChatArgs = {
  data: RemoveUserDto;
};


export type MutationLeaveTaskArgs = {
  taskId: Scalars['String']['input'];
};


export type MutationLikePostArgs = {
  entity: Scalars['String']['input'];
  id: Scalars['String']['input'];
};


export type MutationLinkChatToAssignmentArgs = {
  assignmentId: Scalars['String']['input'];
  chatId: Scalars['String']['input'];
};


export type MutationRemovePostArgs = {
  id: Scalars['String']['input'];
};


export type MutationRemoveUserFromAssignmentArgs = {
  data: CreateRemoveUserAssignmentDto;
};


export type MutationRemoveUserFromChatArgs = {
  data: RemoveUserDto;
};


export type MutationRemoveUsersFromTaskArgs = {
  data: UserTaskDto;
};


export type MutationSearchChatFriendsArgs = {
  chatId: Scalars['String']['input'];
  page: Scalars['Float']['input'];
  query: Scalars['String']['input'];
};


export type MutationSearchFilesByUserArgs = {
  page: Scalars['Float']['input'];
  query: Scalars['String']['input'];
  taskId: Scalars['String']['input'];
};


export type MutationSearchFriendsAlphabeticallyArgs = {
  page: Scalars['Float']['input'];
  value: Scalars['String']['input'];
};


export type MutationSendMessageArgs = {
  data: CreateMessageDto;
};


export type MutationSendTrackingDataArgs = {
  data: TrackingDataDto;
};


export type MutationShareArgs = {
  data: CreateShareDto;
};


export type MutationSigninArgs = {
  data: SigninDto;
};


export type MutationSignupArgs = {
  data: SignupDto;
};


export type MutationTagTaskAsCompletedArgs = {
  taskId: Scalars['String']['input'];
};


export type MutationTransferAssignmentOwnershipArgs = {
  assignmentId: Scalars['String']['input'];
  userId: Scalars['String']['input'];
};


export type MutationTransferOwnershipArgs = {
  chatId: Scalars['String']['input'];
  userId: Scalars['String']['input'];
};


export type MutationUnlikePostArgs = {
  entity: Scalars['String']['input'];
  id: Scalars['String']['input'];
};


export type MutationUnlinkChatAndAssignmentArgs = {
  assignmentId: Scalars['String']['input'];
  chatId: Scalars['String']['input'];
};


export type MutationUnshareArgs = {
  postId: Scalars['String']['input'];
};


export type MutationUpdateAssignmentArgs = {
  data: UpdateAssignmentDto;
};


export type MutationUpdateAssignmentTaskArgs = {
  data: UpdateAssignmentTaskDto;
};


export type MutationUpdateChatSettingsArgs = {
  data: UpdateChatDto;
};


export type MutationUpdateMessagesStatusArgs = {
  chatId: Scalars['String']['input'];
};


export type MutationUpdatePostArgs = {
  updatePost: UpdatePostDto;
};


export type MutationUpdateProfileArgs = {
  data: UpdateProfileDto;
};


export type MutationUpdateReplyArgs = {
  data: UpdateReplyDto;
};


export type MutationUpdateUserArgs = {
  data: UpdateUserDto;
};


export type MutationUpdateUserRoleInAssignmentArgs = {
  data: UpdateUserAssignmentDto;
};


export type MutationUploadFilesArgs = {
  data: UploadFileToTaskDto;
};

export type Notification = {
  __typename?: 'Notification';
  assignmentId?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['String']['output'];
  emitters: Array<BaseUser>;
  friendshipId?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  message: Scalars['String']['output'];
  post?: Maybe<Post>;
  postId?: Maybe<Scalars['String']['output']>;
  reply?: Maybe<Reply>;
  replyId?: Maybe<Scalars['String']['output']>;
  status: NotificationStatus;
  taskId?: Maybe<Scalars['String']['output']>;
  type: NotificationType;
  typeId: Scalars['Int']['output'];
};

export enum NotificationStatus {
  Read = 'READ',
  Unread = 'UNREAD'
}

export type NotificationType = {
  __typename?: 'NotificationType';
  defaultMessage: Scalars['String']['output'];
  name: Scalars['String']['output'];
};

export type Parent = {
  __typename?: 'Parent';
  content?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  hasMedia: Scalars['Boolean']['output'];
  id: Scalars['String']['output'];
  media?: Maybe<Array<Media>>;
  mentions?: Maybe<Array<Mention>>;
  updatedAt: Scalars['DateTime']['output'];
  user: BaseUser;
};

export type Post = {
  __typename?: 'Post';
  actions?: Maybe<Array<Actions>>;
  content?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  hasMedia: Scalars['Boolean']['output'];
  id: Scalars['String']['output'];
  isShared: Scalars['Boolean']['output'];
  key?: Maybe<Scalars['String']['output']>;
  liked: Scalars['Boolean']['output'];
  likes: Scalars['Int']['output'];
  media?: Maybe<Array<Media>>;
  mentions?: Maybe<Array<Mention>>;
  parent?: Maybe<Parent>;
  parentId?: Maybe<Scalars['String']['output']>;
  replies: Scalars['Int']['output'];
  shared: Scalars['Boolean']['output'];
  shares: Scalars['Int']['output'];
  updatedAt: Scalars['DateTime']['output'];
  user: BaseUser;
};

export type PresignedUrl = {
  __typename?: 'PresignedUrl';
  fileUrl: Scalars['String']['output'];
  filename: Scalars['String']['output'];
  type: Scalars['String']['output'];
  uploadUrl: Scalars['String']['output'];
};

export type Query = {
  __typename?: 'Query';
  canNavigateBetweenAssignmentAndChat: ResponseEntity;
  findPostMediaByUserId: Array<Post>;
  getAddableUsers: TaskAddableUsersResponse;
  getAllChats: Array<ChatMessageSub>;
  getAllFilesByTaskId: Array<TaskAllFiles>;
  /** Get all friends from active user */
  getAllFriends: Array<BaseUser>;
  /** Get all friends from active user sorted by alphabetical order */
  getAllFriendsAlphabetically: AlphabeticalFriendsResponse;
  /** Get all online friends from active user */
  getAllOnlineFriends: Array<BaseUser>;
  getAllTasksByAssignmentId: Array<AssignmentList>;
  getAssignmentById: Assignment;
  getAssignmentFriends: AssignmentFriends;
  getAssignmentUsers: Array<AssignmentsUsers>;
  getAssignments: Array<AssignmentList>;
  getCategorizedTaskUsers: TaskAddableUsersResponse;
  getChatActions: Array<ChatActionEntity>;
  getChatById: Chat;
  getChatByUserMember: Chat;
  getChatFriends: ChatFriends;
  getChatMembers: Array<ChatMember>;
  getChatMessages: Array<ChatContent>;
  /** Get children replies for a reply */
  getChildrenReplies: Array<Reply>;
  getCourses: Array<Course>;
  getFriendRequestStatus: FriendshipStatusEnum;
  /** Get all friend requests from active user */
  getFriendRequests: Array<Notification>;
  /** Get all likes by post id */
  getLikeByPostId: LikeWithCount;
  getLinkableChats: Array<Chat>;
  getMentionableUsers: Array<BaseUser>;
  /** Get all notifications from active user */
  getNotifications: Array<Notification>;
  /** Find a post by userId */
  getPostByUserId: Array<Post>;
  getPostLikesByUserId: Array<Post>;
  getShareByPostId: ShareListWithCount;
  getTask: AssignmentTask;
  getTaskMembers: Array<TaskMember>;
  getTrackingData: Array<Tracking>;
  getUserProfile: BaseUser;
  getUsersById: Array<BaseUser>;
  getUsersTaskByAssignmentId: Array<AssignmentList>;
  heartbeat: ResponseEntity;
  me: BaseUser;
  /** Find a post by id */
  postById: Post;
  /** Returns a new JWT Token */
  refreshToken: Token;
  /** Get replies for a post */
  replies: Array<Reply>;
  search: SearchResult;
  searchAddableUsers: TaskAddableUsersResponse;
  searchAssignmentFriends: AssignmentFriends;
  searchUsers: Array<BaseUser>;
  testNotification: Notification;
  timeline: Array<Post>;
  timelineByCourse: Array<Post>;
  /** Get all unread notifications count */
  unreadNotifications: Scalars['Int']['output'];
};


export type QueryCanNavigateBetweenAssignmentAndChatArgs = {
  assignmentId: Scalars['String']['input'];
  chatId: Scalars['String']['input'];
};


export type QueryFindPostMediaByUserIdArgs = {
  id: Scalars['String']['input'];
  page: Scalars['Float']['input'];
};


export type QueryGetAddableUsersArgs = {
  assignmentId: Scalars['String']['input'];
  page: Scalars['Float']['input'];
  taskId: Scalars['String']['input'];
};


export type QueryGetAllChatsArgs = {
  page: Scalars['Float']['input'];
};


export type QueryGetAllFilesByTaskIdArgs = {
  page: Scalars['Float']['input'];
  taskId: Scalars['String']['input'];
};


export type QueryGetAllFriendsArgs = {
  page: Scalars['Float']['input'];
};


export type QueryGetAllFriendsAlphabeticallyArgs = {
  page: Scalars['Float']['input'];
};


export type QueryGetAllTasksByAssignmentIdArgs = {
  assignmentId: Scalars['String']['input'];
  page: Scalars['Float']['input'];
};


export type QueryGetAssignmentByIdArgs = {
  assignmentId: Scalars['String']['input'];
};


export type QueryGetAssignmentFriendsArgs = {
  assignmentId: Scalars['String']['input'];
  page: Scalars['Float']['input'];
};


export type QueryGetAssignmentUsersArgs = {
  assignmentId: Scalars['String']['input'];
  page: Scalars['Float']['input'];
};


export type QueryGetAssignmentsArgs = {
  page: Scalars['Float']['input'];
};


export type QueryGetCategorizedTaskUsersArgs = {
  assignmentId: Scalars['String']['input'];
  page: Scalars['Float']['input'];
};


export type QueryGetChatActionsArgs = {
  chatId: Scalars['String']['input'];
  page: Scalars['Float']['input'];
};


export type QueryGetChatByIdArgs = {
  chatId: Scalars['String']['input'];
};


export type QueryGetChatByUserMemberArgs = {
  userId: Scalars['String']['input'];
};


export type QueryGetChatFriendsArgs = {
  chatId: Scalars['String']['input'];
  page: Scalars['Float']['input'];
};


export type QueryGetChatMembersArgs = {
  chatId: Scalars['String']['input'];
  page: Scalars['Float']['input'];
};


export type QueryGetChatMessagesArgs = {
  chatId: Scalars['String']['input'];
  page: Scalars['Float']['input'];
};


export type QueryGetChildrenRepliesArgs = {
  page: Scalars['Float']['input'];
  parentId: Scalars['String']['input'];
  postId: Scalars['String']['input'];
};


export type QueryGetFriendRequestStatusArgs = {
  id: Scalars['String']['input'];
};


export type QueryGetFriendRequestsArgs = {
  page: Scalars['Float']['input'];
};


export type QueryGetLikeByPostIdArgs = {
  id: Scalars['String']['input'];
  page: Scalars['Float']['input'];
};


export type QueryGetLinkableChatsArgs = {
  assignmentId: Scalars['String']['input'];
  page: Scalars['Float']['input'];
};


export type QueryGetMentionableUsersArgs = {
  content: Scalars['String']['input'];
};


export type QueryGetNotificationsArgs = {
  page: Scalars['Float']['input'];
};


export type QueryGetPostByUserIdArgs = {
  getShare?: InputMaybe<Scalars['Boolean']['input']>;
  id: Scalars['String']['input'];
  page: Scalars['Float']['input'];
};


export type QueryGetPostLikesByUserIdArgs = {
  id: Scalars['String']['input'];
  page: Scalars['Float']['input'];
};


export type QueryGetShareByPostIdArgs = {
  page: Scalars['Float']['input'];
  postId: Scalars['String']['input'];
};


export type QueryGetTaskArgs = {
  taskId: Scalars['String']['input'];
};


export type QueryGetTaskMembersArgs = {
  page: Scalars['Float']['input'];
  taskId: Scalars['String']['input'];
};


export type QueryGetUserProfileArgs = {
  id: Scalars['String']['input'];
};


export type QueryGetUsersByIdArgs = {
  ids: Array<Scalars['String']['input']>;
  page: Scalars['Float']['input'];
};


export type QueryGetUsersTaskByAssignmentIdArgs = {
  assignmentId: Scalars['String']['input'];
  page: Scalars['Float']['input'];
};


export type QueryPostByIdArgs = {
  id: Scalars['String']['input'];
};


export type QueryRefreshTokenArgs = {
  refreshToken: Scalars['String']['input'];
};


export type QueryRepliesArgs = {
  id: Scalars['String']['input'];
  page: Scalars['Float']['input'];
};


export type QuerySearchArgs = {
  page: Scalars['Float']['input'];
  query: Scalars['String']['input'];
};


export type QuerySearchAddableUsersArgs = {
  assignmentId: Scalars['String']['input'];
  page: Scalars['Float']['input'];
  query: Scalars['String']['input'];
  taskId: Scalars['String']['input'];
};


export type QuerySearchAssignmentFriendsArgs = {
  assignmentId: Scalars['String']['input'];
  page: Scalars['Float']['input'];
  query: Scalars['String']['input'];
};


export type QuerySearchUsersArgs = {
  page: Scalars['Float']['input'];
  query: Scalars['String']['input'];
};


export type QueryTimelineArgs = {
  page?: InputMaybe<Scalars['Float']['input']>;
};


export type QueryTimelineByCourseArgs = {
  page: Scalars['Float']['input'];
};

export type RemoveUserDto = {
  chatId: Scalars['String']['input'];
  userToRemoveId?: InputMaybe<Scalars['String']['input']>;
};

export type Reply = {
  __typename?: 'Reply';
  content?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['String']['output'];
  liked: Scalars['Boolean']['output'];
  likes: Scalars['Int']['output'];
  medias?: Maybe<Array<Media>>;
  mentions?: Maybe<Array<BaseUser>>;
  parentId?: Maybe<Scalars['String']['output']>;
  postId: Scalars['String']['output'];
  replies: Scalars['Int']['output'];
  user: BaseUser;
};

export type ResponseEntity = {
  __typename?: 'ResponseEntity';
  /** Any type of complementary data to this specific response. */
  compl_data?: Maybe<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
};

export type SearchResult = {
  __typename?: 'SearchResult';
  posts?: Maybe<Array<Post>>;
  users?: Maybe<Array<BaseUser>>;
};

export type ShareListEntity = {
  __typename?: 'ShareListEntity';
  id: Scalars['String']['output'];
  user: BaseUser;
};

export type ShareListWithCount = {
  __typename?: 'ShareListWithCount';
  count: Scalars['Int']['output'];
  share: Array<ShareListEntity>;
};

export type SigninDto = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type SignupDto = {
  RA: Scalars['Int']['input'];
  courseId: Scalars['String']['input'];
  email: Scalars['String']['input'];
  name: Scalars['String']['input'];
  password: Scalars['String']['input'];
  username: Scalars['String']['input'];
};

export type Subscription = {
  __typename?: 'Subscription';
  activeChat: ChatMessageSub;
  assignmentMember: AssignmentUserSub;
  assignments: AssignmentSub;
  chats: ChatMessageSub;
  /** Subscribes to friends status socket */
  friendStatus: UserStatus;
  message: ChatMessageSub;
  messageStatus: MessageUpdateStatus;
  /** Subscribes to notifications socket */
  notifications: Notification;
  tasks: TaskSub;
  tracking: Tracking;
  /** Send user current status (online/offline) */
  userStatus: BaseUser;
};


export type SubscriptionActiveChatArgs = {
  chatId: Scalars['String']['input'];
};


export type SubscriptionAssignmentMemberArgs = {
  assignmentId: Scalars['String']['input'];
};


export type SubscriptionMessageArgs = {
  messageId: Scalars['String']['input'];
};

export type TaskAddableUser = {
  __typename?: 'TaskAddableUser';
  id: Scalars['String']['output'];
  isMember?: Maybe<Scalars['Boolean']['output']>;
  user: BaseUser;
  userId: Scalars['String']['output'];
};

export type TaskAddableUsers = {
  __typename?: 'TaskAddableUsers';
  friends: Array<TaskAddableUser>;
  letter: Scalars['String']['output'];
};

export type TaskAddableUsersResponse = {
  __typename?: 'TaskAddableUsersResponse';
  count: Scalars['Int']['output'];
  data: Array<TaskAddableUsers>;
  hasNextPage: Scalars['Boolean']['output'];
};

export type TaskAllFiles = {
  __typename?: 'TaskAllFiles';
  files: Array<TaskFiles>;
  user: FileUser;
};

export type TaskFiles = {
  __typename?: 'TaskFiles';
  filename: Scalars['String']['output'];
  id: Scalars['String']['output'];
  taskId: Scalars['String']['output'];
  type: Scalars['String']['output'];
  url: Scalars['String']['output'];
  userId: Scalars['String']['output'];
};

export type TaskMember = {
  __typename?: 'TaskMember';
  completed: Scalars['Boolean']['output'];
  id: Scalars['String']['output'];
  user: BaseUser;
  userId: Scalars['String']['output'];
};

export type TaskSub = {
  __typename?: 'TaskSub';
  action: Scalars['String']['output'];
  assignment: Assignment;
  ids?: Maybe<Array<TaskUsersIds>>;
  task: AssignmentTask;
};

export type TaskUsersIds = {
  __typename?: 'TaskUsersIds';
  id: Scalars['String']['output'];
  userId: Scalars['String']['output'];
};

export type Token = {
  __typename?: 'Token';
  refreshToken: Scalars['String']['output'];
  token: Scalars['String']['output'];
};

export type Tracking = {
  __typename?: 'Tracking';
  avatar?: Maybe<Scalars['String']['output']>;
  banner?: Maybe<Scalars['String']['output']>;
  bio?: Maybe<Scalars['String']['output']>;
  building?: Maybe<Scalars['String']['output']>;
  course?: Maybe<Course>;
  courseId?: Maybe<Scalars['String']['output']>;
  friendsCount?: Maybe<Scalars['Float']['output']>;
  friendship?: Maybe<Friendship>;
  id: Scalars['String']['output'];
  latitude: Scalars['Float']['output'];
  longitude: Scalars['Float']['output'];
  name: Scalars['String']['output'];
  username: Scalars['String']['output'];
};

export type TrackingDataDto = {
  latitude: Scalars['Float']['input'];
  longitude: Scalars['Float']['input'];
};

export type UpdateAssignmentDto = {
  icon?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['String']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateAssignmentTaskDto = {
  description?: InputMaybe<Scalars['String']['input']>;
  dueDate?: InputMaybe<Scalars['DateTime']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  taskId: Scalars['String']['input'];
};

export type UpdateChatDto = {
  chatId: Scalars['String']['input'];
  icon?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<ChatType>;
};

export type UpdateChatUserDto = {
  chatId: Scalars['String']['input'];
  isAdmin: Scalars['Boolean']['input'];
  userToUpdateId?: InputMaybe<Scalars['String']['input']>;
};

export type UpdatePostDto = {
  content?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['String']['input'];
  medias?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type UpdateProfileDto = {
  avatar?: InputMaybe<Scalars['String']['input']>;
  banner?: InputMaybe<Scalars['String']['input']>;
  bio?: InputMaybe<Scalars['String']['input']>;
  courseId?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateReplyDto = {
  content?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['String']['input'];
  medias?: InputMaybe<Array<Scalars['String']['input']>>;
  parentId?: InputMaybe<Scalars['String']['input']>;
  postId?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateUserAssignmentDto = {
  assignmentId: Scalars['String']['input'];
  isAdmin: Scalars['Boolean']['input'];
  userId: Scalars['String']['input'];
};

export type UpdateUserDto = {
  confirmPassword?: InputMaybe<Scalars['String']['input']>;
  currentPassword?: InputMaybe<Scalars['String']['input']>;
  password?: InputMaybe<Scalars['String']['input']>;
  username?: InputMaybe<Scalars['String']['input']>;
};

export type UploadFileToTaskDto = {
  files: Array<UploadTaskItem>;
  taskId: Scalars['String']['input'];
};

export type UploadTaskItem = {
  filename: Scalars['String']['input'];
  type: Scalars['String']['input'];
  url: Scalars['String']['input'];
};

export type UrlRequestDto = {
  name: Scalars['String']['input'];
  source: MediaSource;
  type: Scalars['String']['input'];
};

export type UserStatus = {
  __typename?: 'UserStatus';
  avatar?: Maybe<Scalars['String']['output']>;
  banner?: Maybe<Scalars['String']['output']>;
  bio?: Maybe<Scalars['String']['output']>;
  course?: Maybe<Course>;
  courseId?: Maybe<Scalars['String']['output']>;
  friendsCount?: Maybe<Scalars['Float']['output']>;
  friendship?: Maybe<Friendship>;
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
  online: Scalars['Boolean']['output'];
  username: Scalars['String']['output'];
};

export type UserTaskDto = {
  taskId: Scalars['String']['input'];
  userIds: Array<Scalars['String']['input']>;
};

export type AddUserToAssignmentMutationVariables = Exact<{
  assignmentId: Scalars['String']['input'];
  users: Array<Scalars['String']['input']> | Scalars['String']['input'];
}>;


export type AddUserToAssignmentMutation = { __typename?: 'Mutation', addUserToAssignment: { __typename?: 'ResponseEntity', success: boolean, message?: string | null } };

export type AddUsersToTaskMutationVariables = Exact<{
  taskId: Scalars['String']['input'];
  users: Array<Scalars['String']['input']> | Scalars['String']['input'];
}>;


export type AddUsersToTaskMutation = { __typename?: 'Mutation', addUsersToTask: { __typename?: 'ResponseEntity', success: boolean, message?: string | null } };

export type CreateAssignmentMutationVariables = Exact<{
  icon?: InputMaybe<Scalars['String']['input']>;
  users?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
  name: Scalars['String']['input'];
}>;


export type CreateAssignmentMutation = { __typename?: 'Mutation', createAssignment: { __typename?: 'Assignment', id: string, name: string, ownerId: string, createdAt: string } };

export type CreateAssignmentTaskMutationVariables = Exact<{
  name: Scalars['String']['input'];
  assignmentId: Scalars['String']['input'];
  dueDate: Scalars['DateTime']['input'];
  users?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
}>;


export type CreateAssignmentTaskMutation = { __typename?: 'Mutation', createAssignmentTask: { __typename?: 'AssignmentTask', id: string, assignmentId: string, description?: string | null, dueDate?: any | null } };

export type DeleteAssignmentMutationVariables = Exact<{
  assignmentId: Scalars['String']['input'];
}>;


export type DeleteAssignmentMutation = { __typename?: 'Mutation', deleteAssignment: { __typename?: 'ResponseEntity', success: boolean, message?: string | null } };

export type DeleteFileMutationVariables = Exact<{
  taskId: Scalars['String']['input'];
  fileUrl: Scalars['String']['input'];
}>;


export type DeleteFileMutation = { __typename?: 'Mutation', deleteFile: { __typename?: 'ResponseEntity', success: boolean, message?: string | null } };

export type DeleteAssignmentTaskMutationVariables = Exact<{
  taskId: Scalars['String']['input'];
}>;


export type DeleteAssignmentTaskMutation = { __typename?: 'Mutation', deleteAssignmentTask: { __typename?: 'ResponseEntity', success: boolean, message?: string | null } };

export type LeaveAssignmentMutationVariables = Exact<{
  assignmentId: Scalars['String']['input'];
}>;


export type LeaveAssignmentMutation = { __typename?: 'Mutation', leaveAssignment: { __typename?: 'ResponseEntity', success: boolean, message?: string | null } };

export type LeaveTaskMutationVariables = Exact<{
  taskId: Scalars['String']['input'];
}>;


export type LeaveTaskMutation = { __typename?: 'Mutation', leaveTask: { __typename?: 'ResponseEntity', success: boolean, message?: string | null } };

export type LinkChatToAssignmentMutationVariables = Exact<{
  assignmentId: Scalars['String']['input'];
  chatId: Scalars['String']['input'];
}>;


export type LinkChatToAssignmentMutation = { __typename?: 'Mutation', linkChatToAssignment: { __typename?: 'ResponseEntity', success: boolean, message?: string | null } };

export type RemoveUserFromAssignmentMutationVariables = Exact<{
  assignmentId: Scalars['String']['input'];
  userId: Scalars['String']['input'];
}>;


export type RemoveUserFromAssignmentMutation = { __typename?: 'Mutation', removeUserFromAssignment: { __typename?: 'ResponseEntity', success: boolean, message?: string | null } };

export type RemoveUsersFromTaskMutationVariables = Exact<{
  taskId: Scalars['String']['input'];
  userIds: Array<Scalars['String']['input']> | Scalars['String']['input'];
}>;


export type RemoveUsersFromTaskMutation = { __typename?: 'Mutation', removeUsersFromTask: { __typename?: 'ResponseEntity', success: boolean, message?: string | null } };

export type SearchFilesByUserMutationVariables = Exact<{
  taskId: Scalars['String']['input'];
  query: Scalars['String']['input'];
  page: Scalars['Float']['input'];
}>;


export type SearchFilesByUserMutation = { __typename?: 'Mutation', searchFilesByUser: Array<{ __typename?: 'TaskAllFiles', user: { __typename?: 'FileUser', id: string, user: { __typename?: 'BaseUser', id: string, name: string, username: string, avatar?: string | null } }, files: Array<{ __typename?: 'TaskFiles', filename: string, url: string, type: string, id: string }> }> };

export type TagTaskAsCompletedMutationVariables = Exact<{
  taskId: Scalars['String']['input'];
}>;


export type TagTaskAsCompletedMutation = { __typename?: 'Mutation', tagTaskAsCompleted: { __typename?: 'ResponseEntity', success: boolean, message?: string | null } };

export type TransferAssignmentOwnershipMutationVariables = Exact<{
  assignmentId: Scalars['String']['input'];
  userId: Scalars['String']['input'];
}>;


export type TransferAssignmentOwnershipMutation = { __typename?: 'Mutation', transferAssignmentOwnership: { __typename?: 'ResponseEntity', success: boolean, message?: string | null } };

export type UnlinkChatAndAssignmentMutationVariables = Exact<{
  assignmentId: Scalars['String']['input'];
  chatId: Scalars['String']['input'];
}>;


export type UnlinkChatAndAssignmentMutation = { __typename?: 'Mutation', unlinkChatAndAssignment: { __typename?: 'ResponseEntity', success: boolean, message?: string | null } };

export type UpdateAssignmentMutationVariables = Exact<{
  icon?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  assignmentId: Scalars['String']['input'];
}>;


export type UpdateAssignmentMutation = { __typename?: 'Mutation', updateAssignment: { __typename?: 'Assignment', id: string, name: string, icon?: string | null, createdAt: string, ownerId: string } };

export type UpdateAssignmentTaskMutationVariables = Exact<{
  name?: InputMaybe<Scalars['String']['input']>;
  taskId: Scalars['String']['input'];
  dueDate?: InputMaybe<Scalars['DateTime']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
}>;


export type UpdateAssignmentTaskMutation = { __typename?: 'Mutation', updateAssignmentTask: { __typename?: 'AssignmentTask', id: string, assignmentId: string, description?: string | null, dueDate?: any | null, name: string } };

export type UpdateUserRoleInAssignmentMutationVariables = Exact<{
  userId: Scalars['String']['input'];
  isAdmin: Scalars['Boolean']['input'];
  assignmentId: Scalars['String']['input'];
}>;


export type UpdateUserRoleInAssignmentMutation = { __typename?: 'Mutation', updateUserRoleInAssignment: { __typename?: 'ResponseEntity', message?: string | null, success: boolean } };

export type UploadFilesMutationVariables = Exact<{
  data: UploadFileToTaskDto;
}>;


export type UploadFilesMutation = { __typename?: 'Mutation', uploadFiles: { __typename?: 'ResponseEntity', success: boolean, message?: string | null } };

export type CanNavigateBetweenAssignmentAndChatQueryVariables = Exact<{
  assignmentId: Scalars['String']['input'];
  chatId: Scalars['String']['input'];
}>;


export type CanNavigateBetweenAssignmentAndChatQuery = { __typename?: 'Query', canNavigateBetweenAssignmentAndChat: { __typename?: 'ResponseEntity', message?: string | null, success: boolean } };

export type GetAddableUsersQueryVariables = Exact<{
  assignmentId: Scalars['String']['input'];
  page: Scalars['Float']['input'];
  taskId: Scalars['String']['input'];
}>;


export type GetAddableUsersQuery = { __typename?: 'Query', getAddableUsers: { __typename?: 'TaskAddableUsersResponse', hasNextPage: boolean, count: number, data: Array<{ __typename?: 'TaskAddableUsers', letter: string, friends: Array<{ __typename?: 'TaskAddableUser', id: string, isMember?: boolean | null, user: { __typename?: 'BaseUser', name: string, avatar?: string | null, username: string, id: string } }> }> } };

export type GetAllFilesByTaskIdQueryVariables = Exact<{
  taskId: Scalars['String']['input'];
  page: Scalars['Float']['input'];
}>;


export type GetAllFilesByTaskIdQuery = { __typename?: 'Query', getAllFilesByTaskId: Array<{ __typename?: 'TaskAllFiles', user: { __typename?: 'FileUser', id: string, user: { __typename?: 'BaseUser', id: string, name: string, username: string, avatar?: string | null } }, files: Array<{ __typename?: 'TaskFiles', filename: string, url: string, type: string, id: string }> }> };

export type GetAllTasksByAssignmentIdQueryVariables = Exact<{
  assignmentId: Scalars['String']['input'];
  page: Scalars['Float']['input'];
}>;


export type GetAllTasksByAssignmentIdQuery = { __typename?: 'Query', getAllTasksByAssignmentId: Array<{ __typename?: 'AssignmentList', dueDate: any, item: Array<{ __typename?: 'AssignmentListItem', name: string, id: string, isPending: boolean, dueDate: string, description?: string | null }> }> };

export type GetAssignmentByIdQueryVariables = Exact<{
  assignmentId: Scalars['String']['input'];
}>;


export type GetAssignmentByIdQuery = { __typename?: 'Query', getAssignmentById: { __typename?: 'Assignment', id: string, name: string, icon?: string | null, createdAt: string, ownerId: string, isAdmin?: boolean | null, chatId?: string | null } };

export type GetAssignmentFriendsQueryVariables = Exact<{
  assignmentId: Scalars['String']['input'];
  page: Scalars['Float']['input'];
}>;


export type GetAssignmentFriendsQuery = { __typename?: 'Query', getAssignmentFriends: { __typename?: 'AssignmentFriends', hasNextPage: boolean, count: number, data: Array<{ __typename?: 'AssignmentFriend', letter: string, friends: Array<{ __typename?: 'BaseUserExtended', id: string, isMember: boolean, name: string, avatar?: string | null, username: string }> }> } };

export type GetAssignmentUsersQueryVariables = Exact<{
  assignmentId: Scalars['String']['input'];
  page: Scalars['Float']['input'];
}>;


export type GetAssignmentUsersQuery = { __typename?: 'Query', getAssignmentUsers: Array<{ __typename?: 'AssignmentsUsers', id: string, isAdmin: boolean, assignmentId: string, userId: string, user: { __typename?: 'BaseUser', id: string, name: string, username: string, avatar?: string | null } }> };

export type GetAssignmentsQueryVariables = Exact<{
  page: Scalars['Float']['input'];
}>;


export type GetAssignmentsQuery = { __typename?: 'Query', getAssignments: Array<{ __typename?: 'AssignmentList', dueDate: any, item: Array<{ __typename?: 'AssignmentListItem', dueDate: string, icon?: string | null, id: string, isPending: boolean, name: string, pendingCount?: number | null }> }> };

export type GetCategorizedTaskUsersQueryVariables = Exact<{
  assignmentId: Scalars['String']['input'];
  page: Scalars['Float']['input'];
}>;


export type GetCategorizedTaskUsersQuery = { __typename?: 'Query', getCategorizedTaskUsers: { __typename?: 'TaskAddableUsersResponse', hasNextPage: boolean, data: Array<{ __typename?: 'TaskAddableUsers', letter: string, friends: Array<{ __typename?: 'TaskAddableUser', id: string, isMember?: boolean | null, user: { __typename?: 'BaseUser', name: string, avatar?: string | null, username: string, id: string } }> }> } };

export type GetLinkableChatsQueryVariables = Exact<{
  assignmentId: Scalars['String']['input'];
  page: Scalars['Float']['input'];
}>;


export type GetLinkableChatsQuery = { __typename?: 'Query', getLinkableChats: Array<{ __typename?: 'Chat', icon?: string | null, name: string, id: string }> };

export type GetTaskQueryVariables = Exact<{
  taskId: Scalars['String']['input'];
}>;


export type GetTaskQuery = { __typename?: 'Query', getTask: { __typename?: 'AssignmentTask', id: string, assignmentId: string, description?: string | null, name: string, dueDate?: any | null, completed: boolean, isMember: boolean, totalCount: number, completedCount: number, ownerId: string, files: Array<{ __typename?: 'TaskFiles', url: string, userId: string, filename: string }> } };

export type GetTaskMembersQueryVariables = Exact<{
  taskId: Scalars['String']['input'];
  page: Scalars['Float']['input'];
}>;


export type GetTaskMembersQuery = { __typename?: 'Query', getTaskMembers: Array<{ __typename?: 'TaskMember', id: string, userId: string, completed: boolean, user: { __typename?: 'BaseUser', avatar?: string | null, name: string, username: string, id: string } }> };

export type GetUsersTaskByAssignmentIdQueryVariables = Exact<{
  assignmentId: Scalars['String']['input'];
  page: Scalars['Float']['input'];
}>;


export type GetUsersTaskByAssignmentIdQuery = { __typename?: 'Query', getUsersTaskByAssignmentId: Array<{ __typename?: 'AssignmentList', dueDate: any, item: Array<{ __typename?: 'AssignmentListItem', name: string, id: string, isPending: boolean, dueDate: string, description?: string | null }> }> };

export type SearchAddableUsersQueryVariables = Exact<{
  assignmentId: Scalars['String']['input'];
  taskId: Scalars['String']['input'];
  page: Scalars['Float']['input'];
  query: Scalars['String']['input'];
}>;


export type SearchAddableUsersQuery = { __typename?: 'Query', searchAddableUsers: { __typename?: 'TaskAddableUsersResponse', hasNextPage: boolean, data: Array<{ __typename?: 'TaskAddableUsers', letter: string, friends: Array<{ __typename?: 'TaskAddableUser', id: string, isMember?: boolean | null, user: { __typename?: 'BaseUser', name: string, avatar?: string | null, username: string, id: string } }> }> } };

export type SearchAssignmentFriendsQueryVariables = Exact<{
  assignmentId: Scalars['String']['input'];
  page: Scalars['Float']['input'];
  query: Scalars['String']['input'];
}>;


export type SearchAssignmentFriendsQuery = { __typename?: 'Query', searchAssignmentFriends: { __typename?: 'AssignmentFriends', hasNextPage: boolean, data: Array<{ __typename?: 'AssignmentFriend', letter: string, friends: Array<{ __typename?: 'BaseUserExtended', id: string, isMember: boolean, name: string, avatar?: string | null, username: string }> }> } };

export type AssignmentMemberSubscriptionVariables = Exact<{
  assignmentId: Scalars['String']['input'];
}>;


export type AssignmentMemberSubscription = { __typename?: 'Subscription', assignmentMember: { __typename?: 'AssignmentUserSub', action?: string | null, assignment: { __typename?: 'Assignment', id: string, chatId?: string | null, name: string, ownerId: string, icon?: string | null }, member?: { __typename?: 'AssignmentsUsers', isAdmin: boolean, user: { __typename?: 'BaseUser', avatar?: string | null, name: string, id: string, username: string } } | null } };

export type AssignmentsSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type AssignmentsSubscription = { __typename?: 'Subscription', assignments: { __typename?: 'AssignmentSub', action?: string | null, assignment: { __typename?: 'Assignment', id: string, name: string, icon?: string | null, createdAt: string, ownerId: string, chatId?: string | null, isAdmin?: boolean | null }, member?: { __typename?: 'AssignmentsUsers', id: string, userId: string, isAdmin: boolean, user: { __typename?: 'BaseUser', id: string, name: string, avatar?: string | null, username: string } } | null } };

export type TasksSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type TasksSubscription = { __typename?: 'Subscription', tasks: { __typename?: 'TaskSub', action: string, assignment: { __typename?: 'Assignment', id: string, ownerId: string }, task: { __typename?: 'AssignmentTask', id: string, name: string, dueDate?: any | null, description?: string | null }, ids?: Array<{ __typename?: 'TaskUsersIds', userId: string, id: string }> | null } };

export type SigninMutationVariables = Exact<{
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
}>;


export type SigninMutation = { __typename?: 'Mutation', signin: { __typename?: 'Token', token: string, refreshToken: string } };

export type SignupMutationVariables = Exact<{
  data: SignupDto;
}>;


export type SignupMutation = { __typename?: 'Mutation', signup: { __typename?: 'ResponseEntity', message?: string | null, success: boolean } };

export type RefreshTokenQueryVariables = Exact<{
  refreshToken: Scalars['String']['input'];
}>;


export type RefreshTokenQuery = { __typename?: 'Query', refreshToken: { __typename?: 'Token', token: string, refreshToken: string } };

export type AddUserToChatMutationVariables = Exact<{
  chatId: Scalars['String']['input'];
  users: Array<Scalars['String']['input']> | Scalars['String']['input'];
}>;


export type AddUserToChatMutation = { __typename?: 'Mutation', addUserToChat: { __typename?: 'Chat', id: string, isDirect: boolean, name: string, type: ChatType, createdAt: string, icon?: string | null } };

export type ChangeUserRoleMutationVariables = Exact<{
  chatId: Scalars['String']['input'];
  userId: Scalars['String']['input'];
  isAdmin: Scalars['Boolean']['input'];
}>;


export type ChangeUserRoleMutation = { __typename?: 'Mutation', changeUserRole: { __typename?: 'ResponseEntity', success: boolean, message?: string | null } };

export type CreateChatMutationVariables = Exact<{
  icon?: InputMaybe<Scalars['String']['input']>;
  users?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
  type: ChatType;
  name?: InputMaybe<Scalars['String']['input']>;
  isDirect: Scalars['Boolean']['input'];
}>;


export type CreateChatMutation = { __typename?: 'Mutation', createChat: { __typename?: 'Chat', id: string, isDirect: boolean, name: string, type: ChatType, createdAt: string, isOnline?: boolean | null } };

export type LeaveChatMutationVariables = Exact<{
  chatId: Scalars['String']['input'];
  user: Scalars['String']['input'];
}>;


export type LeaveChatMutation = { __typename?: 'Mutation', leaveChat: { __typename?: 'Chat', id: string, isDirect: boolean, name: string, type: ChatType, createdAt: string, icon?: string | null } };

export type RemoveUserFromChatMutationVariables = Exact<{
  chatId: Scalars['String']['input'];
  user: Scalars['String']['input'];
}>;


export type RemoveUserFromChatMutation = { __typename?: 'Mutation', removeUserFromChat: { __typename?: 'Chat', id: string, isDirect: boolean, name: string, type: ChatType, createdAt: string, icon?: string | null, isAdmin?: boolean | null } };

export type SearchChatFriendsMutationVariables = Exact<{
  chatId: Scalars['String']['input'];
  page: Scalars['Float']['input'];
  query: Scalars['String']['input'];
}>;


export type SearchChatFriendsMutation = { __typename?: 'Mutation', searchChatFriends: { __typename?: 'ChatFriends', hasNextPage: boolean, data: Array<{ __typename?: 'ChatFriend', letter: string, friends: Array<{ __typename?: 'BaseUserExtended', id: string, isMember: boolean, name: string, avatar?: string | null, username: string }> }> } };

export type TransferOwnershipMutationVariables = Exact<{
  chatId: Scalars['String']['input'];
  newOwnerId: Scalars['String']['input'];
}>;


export type TransferOwnershipMutation = { __typename?: 'Mutation', transferOwnership: { __typename?: 'Chat', id: string, isDirect: boolean, name: string, type: ChatType, createdAt: string, isOnline?: boolean | null, icon?: string | null, isAdmin?: boolean | null, ownerId?: string | null } };

export type UpdateChatSettingsMutationVariables = Exact<{
  icon?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  chatId: Scalars['String']['input'];
  type: ChatType;
}>;


export type UpdateChatSettingsMutation = { __typename?: 'Mutation', updateChatSettings: { __typename?: 'Chat', id: string, isDirect: boolean, name: string, type: ChatType, createdAt: string, isOnline?: boolean | null, isAdmin?: boolean | null } };

export type GetAllChatsQueryVariables = Exact<{
  page: Scalars['Float']['input'];
}>;


export type GetAllChatsQuery = { __typename?: 'Query', getAllChats: Array<{ __typename?: 'ChatMessageSub', chat: { __typename?: 'Chat', id: string, isDirect: boolean, name: string, type: ChatType, icon?: string | null, unreadMessages?: number | null, createdAt: string, isOnline?: boolean | null, directUserMember?: string | null }, message?: { __typename?: 'Message', content: string, id: string, createdAt: string, hasMedia: boolean, user: { __typename?: 'BaseUser', name: string, username: string, id: string, avatar?: string | null }, media?: Array<{ __typename?: 'Media', id: string, url: string }> | null, messageStatus?: Array<{ __typename?: 'MessageStatus', status: MessageStatusEnum, messageId: string, userId: string, user: { __typename?: 'BaseUser', id: string, name: string, username: string, avatar?: string | null } }> | null } | null, chatAction?: { __typename?: 'ChatActionEntity', action: string, createdAt: string, chatId: string, id: string, actionAuthor: { __typename?: 'BaseUser', avatar?: string | null, name: string, username: string, id: string }, user?: { __typename?: 'CustomChatBaseUser', avatar?: string | null, id: string, name: string, username: string } | null } | null }> };

export type GetChatByIdQueryVariables = Exact<{
  chatId: Scalars['String']['input'];
}>;


export type GetChatByIdQuery = { __typename?: 'Query', getChatById: { __typename?: 'Chat', id: string, isDirect: boolean, name: string, type: ChatType, createdAt: string, isOnline?: boolean | null, icon?: string | null, isAdmin?: boolean | null, ownerId?: string | null, directUserMember?: string | null } };

export type GetChatByUserMemberQueryVariables = Exact<{
  userId: Scalars['String']['input'];
}>;


export type GetChatByUserMemberQuery = { __typename?: 'Query', getChatByUserMember: { __typename?: 'Chat', id: string, isDirect: boolean, name: string, type: ChatType, createdAt: string, isOnline?: boolean | null } };

export type GetChatFriendsQueryVariables = Exact<{
  chatId: Scalars['String']['input'];
  page: Scalars['Float']['input'];
}>;


export type GetChatFriendsQuery = { __typename?: 'Query', getChatFriends: { __typename?: 'ChatFriends', hasNextPage: boolean, count: number, data: Array<{ __typename?: 'ChatFriend', letter: string, friends: Array<{ __typename?: 'BaseUserExtended', id: string, isMember: boolean, name: string, avatar?: string | null, username: string }> }> } };

export type GetChatMembersQueryVariables = Exact<{
  chatId: Scalars['String']['input'];
  page: Scalars['Float']['input'];
}>;


export type GetChatMembersQuery = { __typename?: 'Query', getChatMembers: Array<{ __typename?: 'ChatMember', id: string, isAdmin: boolean, user: { __typename?: 'BaseUser', name: string, id: string, avatar?: string | null, username: string } }> };

export type ActiveChatSubscriptionVariables = Exact<{
  chatId: Scalars['String']['input'];
}>;


export type ActiveChatSubscription = { __typename?: 'Subscription', activeChat: { __typename?: 'ChatMessageSub', chat: { __typename?: 'Chat', id: string, isDirect: boolean, name: string, type: ChatType, unreadMessages?: number | null, ownerId?: string | null, createdAt: string, isAdmin?: boolean | null, icon?: string | null }, message?: { __typename?: 'Message', content: string, id: string, createdAt: string, deletedAt?: string | null, hasMedia: boolean, user: { __typename?: 'BaseUser', name: string, username: string, id: string, avatar?: string | null }, media?: Array<{ __typename?: 'Media', id: string, url: string }> | null, messageStatus?: Array<{ __typename?: 'MessageStatus', status: MessageStatusEnum, messageId: string, userId: string, user: { __typename?: 'BaseUser', id: string, name: string, username: string, avatar?: string | null } }> | null } | null, chatAction?: { __typename?: 'ChatActionEntity', id: string, action: string, message?: string | null, createdAt: string, actionAuthor: { __typename?: 'BaseUser', avatar?: string | null, name: string, username: string, id: string }, user?: { __typename?: 'CustomChatBaseUser', avatar?: string | null, id: string, name: string, username: string, isAdmin?: boolean | null } | null } | null } };

export type ChatsSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type ChatsSubscription = { __typename?: 'Subscription', chats: { __typename?: 'ChatMessageSub', chat: { __typename?: 'Chat', id: string, isDirect: boolean, name: string, type: ChatType, unreadMessages?: number | null, ownerId?: string | null, createdAt: string, icon?: string | null }, message?: { __typename?: 'Message', content: string, deletedAt?: string | null, id: string, createdAt: string, hasMedia: boolean, user: { __typename?: 'BaseUser', name: string, username: string, id: string, avatar?: string | null }, media?: Array<{ __typename?: 'Media', id: string, url: string }> | null, messageStatus?: Array<{ __typename?: 'MessageStatus', status: MessageStatusEnum, messageId: string, userId: string, user: { __typename?: 'BaseUser', id: string, name: string, username: string, avatar?: string | null } }> | null } | null, chatAction?: { __typename?: 'ChatActionEntity', action: string, message?: string | null, createdAt: string, chatId: string, id: string, actionAuthor: { __typename?: 'BaseUser', avatar?: string | null, name: string, username: string, id: string }, user?: { __typename?: 'CustomChatBaseUser', avatar?: string | null, id: string, name: string, username: string } | null } | null } };

export type GetCoursesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetCoursesQuery = { __typename?: 'Query', getCourses: Array<{ __typename?: 'Course', id: string, name: string }> };

export type AcceptFriendshipMutationVariables = Exact<{
  friendshipId: Scalars['String']['input'];
}>;


export type AcceptFriendshipMutation = { __typename?: 'Mutation', acceptFriendship: { __typename?: 'ResponseEntity', message?: string | null, success: boolean, compl_data?: string | null } };

export type CreateFriendshipMutationVariables = Exact<{
  friendId: Scalars['String']['input'];
}>;


export type CreateFriendshipMutation = { __typename?: 'Mutation', createFriendship: { __typename?: 'ResponseEntity', message?: string | null, success: boolean, compl_data?: string | null } };

export type DeleteFriendshipMutationVariables = Exact<{
  friendshipId: Scalars['String']['input'];
}>;


export type DeleteFriendshipMutation = { __typename?: 'Mutation', deleteFriendship: { __typename?: 'ResponseEntity', message?: string | null, success: boolean, compl_data?: string | null } };

export type GetAllFriendsQueryVariables = Exact<{
  page: Scalars['Float']['input'];
}>;


export type GetAllFriendsQuery = { __typename?: 'Query', getAllFriends: Array<{ __typename?: 'BaseUser', id: string, name: string, username: string, avatar?: string | null }> };

export type GetAllFriendsAlphabeticallyQueryVariables = Exact<{
  page: Scalars['Float']['input'];
}>;


export type GetAllFriendsAlphabeticallyQuery = { __typename?: 'Query', getAllFriendsAlphabetically: { __typename?: 'AlphabeticalFriendsResponse', data: any, hasNextPage: boolean } };

export type GetFriendRequestStatusQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type GetFriendRequestStatusQuery = { __typename?: 'Query', getFriendRequestStatus: FriendshipStatusEnum };

export type GetAllOnlineFriendsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllOnlineFriendsQuery = { __typename?: 'Query', getAllOnlineFriends: Array<{ __typename?: 'BaseUser', id: string, name: string, username: string, avatar?: string | null }> };

export type SearchFriendsAlphabeticallyMutationVariables = Exact<{
  page: Scalars['Float']['input'];
  value: Scalars['String']['input'];
}>;


export type SearchFriendsAlphabeticallyMutation = { __typename?: 'Mutation', searchFriendsAlphabetically: { __typename?: 'AlphabeticalFriendsResponse', data: any, hasNextPage: boolean } };

export type FriendStatusSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type FriendStatusSubscription = { __typename?: 'Subscription', friendStatus: { __typename?: 'UserStatus', id: string, online: boolean, name: string, avatar?: string | null, username: string } };

export type GetMentionableUsersQueryVariables = Exact<{
  content: Scalars['String']['input'];
}>;


export type GetMentionableUsersQuery = { __typename?: 'Query', getMentionableUsers: Array<{ __typename?: 'BaseUser', id: string, name: string, username: string, avatar?: string | null }> };

export type DeleteMessageMutationVariables = Exact<{
  messageId: Scalars['String']['input'];
  chatId: Scalars['String']['input'];
}>;


export type DeleteMessageMutation = { __typename?: 'Mutation', deleteMessage: { __typename?: 'ResponseEntity', success: boolean, message?: string | null } };

export type SendMessageMutationVariables = Exact<{
  content?: InputMaybe<Scalars['String']['input']>;
  chatId?: InputMaybe<Scalars['String']['input']>;
  medias?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
}>;


export type SendMessageMutation = { __typename?: 'Mutation', sendMessage: { __typename?: 'Message', id: string, content: string, createdAt: string, deletedAt?: string | null, hasMedia: boolean, media?: Array<{ __typename?: 'Media', id: string, messageId?: string | null, url: string }> | null, user: { __typename?: 'BaseUser', id: string, username: string, avatar?: string | null, name: string } } };

export type GetChatMessagesQueryVariables = Exact<{
  chatId: Scalars['String']['input'];
  page: Scalars['Float']['input'];
}>;


export type GetChatMessagesQuery = { __typename?: 'Query', getChatMessages: Array<{ __typename?: 'ChatContent', id: string, createdAt: any, system: boolean, message?: { __typename?: 'ContentMessage', content: string, hasMedia: boolean, media?: { __typename?: 'ContentMedia', urls?: Array<string | null> | null } | null } | null, author: { __typename?: 'BaseUser', id: string, username: string, avatar?: string | null, name: string }, action?: { __typename?: 'ContentAction', action: string, message?: string | null, user: { __typename?: 'BaseUser', avatar?: string | null, username: string, name: string } } | null }> };

export type UpdateMessagesStatusMutationVariables = Exact<{
  chatId: Scalars['String']['input'];
}>;


export type UpdateMessagesStatusMutation = { __typename?: 'Mutation', updateMessagesStatus: { __typename?: 'ResponseEntity', message?: string | null, success: boolean } };

export type GetFriendRequestsQueryVariables = Exact<{
  page: Scalars['Float']['input'];
}>;


export type GetFriendRequestsQuery = { __typename?: 'Query', getFriendRequests: Array<{ __typename?: 'Notification', id: string, postId?: string | null, replyId?: string | null, friendshipId?: string | null, message: string, status: NotificationStatus, createdAt: string, emitters: Array<{ __typename?: 'BaseUser', id: string, username: string, avatar?: string | null, name: string }>, type: { __typename?: 'NotificationType', name: string }, post?: { __typename?: 'Post', content?: string | null, mentions?: Array<{ __typename?: 'Mention', user: { __typename?: 'BaseUser', name: string, username: string } }> | null } | null, reply?: { __typename?: 'Reply', content?: string | null, mentions?: Array<{ __typename?: 'BaseUser', name: string, username: string }> | null } | null }> };

export type GetNotificationsQueryVariables = Exact<{
  page: Scalars['Float']['input'];
}>;


export type GetNotificationsQuery = { __typename?: 'Query', getNotifications: Array<{ __typename?: 'Notification', id: string, postId?: string | null, replyId?: string | null, assignmentId?: string | null, taskId?: string | null, friendshipId?: string | null, message: string, status: NotificationStatus, createdAt: string, emitters: Array<{ __typename?: 'BaseUser', id: string, username: string, avatar?: string | null, name: string }>, type: { __typename?: 'NotificationType', name: string }, post?: { __typename?: 'Post', content?: string | null, mentions?: Array<{ __typename?: 'Mention', user: { __typename?: 'BaseUser', name: string, username: string } }> | null } | null, reply?: { __typename?: 'Reply', content?: string | null, mentions?: Array<{ __typename?: 'BaseUser', name: string, username: string }> | null } | null }> };

export type UnreadNotificationsQueryVariables = Exact<{ [key: string]: never; }>;


export type UnreadNotificationsQuery = { __typename?: 'Query', unreadNotifications: number };

export type NotificationsSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type NotificationsSubscription = { __typename?: 'Subscription', notifications: { __typename?: 'Notification', id: string, postId?: string | null, replyId?: string | null, friendshipId?: string | null, message: string, status: NotificationStatus, createdAt: string, emitters: Array<{ __typename?: 'BaseUser', id: string, username: string, avatar?: string | null, name: string }>, type: { __typename?: 'NotificationType', name: string }, post?: { __typename?: 'Post', content?: string | null, mentions?: Array<{ __typename?: 'Mention', user: { __typename?: 'BaseUser', name: string, username: string } }> | null } | null, reply?: { __typename?: 'Reply', content?: string | null, mentions?: Array<{ __typename?: 'BaseUser', name: string, username: string }> | null } | null } };

export type CreatePostMutationVariables = Exact<{
  content?: InputMaybe<Scalars['String']['input']>;
  medias?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
}>;


export type CreatePostMutation = { __typename?: 'Mutation', createPost: { __typename?: 'Post', id: string, content?: string | null, key?: string | null, createdAt: any, hasMedia: boolean, isShared: boolean, liked: boolean, shared: boolean, shares: number, likes: number, replies: number, actions?: Array<{ __typename?: 'Actions', createdAt: any, id?: string | null, type: string, author?: { __typename?: 'BaseUser', id: string, avatar?: string | null, name: string, username: string } | null }> | null, user: { __typename?: 'BaseUser', name: string, avatar?: string | null, id: string, username: string }, media?: Array<{ __typename?: 'Media', id: string, url: string }> | null, parent?: { __typename?: 'Parent', content?: string | null, hasMedia: boolean, createdAt: any, user: { __typename?: 'BaseUser', avatar?: string | null, id: string, name: string, username: string }, media?: Array<{ __typename?: 'Media', id: string, url: string }> | null } | null } };

export type CreateReplyMutationVariables = Exact<{
  content?: InputMaybe<Scalars['String']['input']>;
  medias?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
  postId: Scalars['String']['input'];
  parentId?: InputMaybe<Scalars['String']['input']>;
}>;


export type CreateReplyMutation = { __typename?: 'Mutation', createReply: { __typename?: 'Reply', id: string, content?: string | null, createdAt: any, likes: number, parentId?: string | null, postId: string, replies: number, liked: boolean, user: { __typename?: 'BaseUser', id: string, name: string, avatar?: string | null, username: string }, mentions?: Array<{ __typename?: 'BaseUser', id: string, name: string, avatar?: string | null, username: string }> | null, medias?: Array<{ __typename?: 'Media', id: string, replyId?: string | null, url: string, postId?: string | null }> | null } };

export type DeleteReplyMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type DeleteReplyMutation = { __typename?: 'Mutation', deleteReply: { __typename?: 'ResponseEntity', message?: string | null, success: boolean } };

export type LikePostMutationVariables = Exact<{
  postId: Scalars['String']['input'];
}>;


export type LikePostMutation = { __typename?: 'Mutation', likePost: { __typename?: 'ResponseEntity', message?: string | null, success: boolean } };

export type LikeReplyMutationVariables = Exact<{
  replyId: Scalars['String']['input'];
}>;


export type LikeReplyMutation = { __typename?: 'Mutation', likePost: { __typename?: 'ResponseEntity', message?: string | null, success: boolean } };

export type RemovePostMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type RemovePostMutation = { __typename?: 'Mutation', removePost: { __typename?: 'Post', id: string } };

export type SharePostMutationVariables = Exact<{
  content?: InputMaybe<Scalars['String']['input']>;
  medias?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
  parentId: Scalars['String']['input'];
}>;


export type SharePostMutation = { __typename?: 'Mutation', share: { __typename?: 'Post', id: string, content?: string | null, key?: string | null, createdAt: any, hasMedia: boolean, isShared: boolean, liked: boolean, shared: boolean, shares: number, likes: number, replies: number, actions?: Array<{ __typename?: 'Actions', createdAt: any, id?: string | null, type: string, author?: { __typename?: 'BaseUser', id: string, avatar?: string | null, name: string, username: string } | null }> | null, user: { __typename?: 'BaseUser', name: string, avatar?: string | null, id: string, username: string }, media?: Array<{ __typename?: 'Media', id: string, url: string }> | null, parent?: { __typename?: 'Parent', content?: string | null, hasMedia: boolean, createdAt: any, user: { __typename?: 'BaseUser', avatar?: string | null, id: string, name: string, username: string }, media?: Array<{ __typename?: 'Media', id: string, url: string }> | null } | null } };

export type UnlikePostMutationVariables = Exact<{
  postId: Scalars['String']['input'];
}>;


export type UnlikePostMutation = { __typename?: 'Mutation', unlikePost: { __typename?: 'ResponseEntity', message?: string | null, success: boolean } };

export type UnlikeReplyMutationVariables = Exact<{
  replyId: Scalars['String']['input'];
}>;


export type UnlikeReplyMutation = { __typename?: 'Mutation', unlikePost: { __typename?: 'ResponseEntity', message?: string | null, success: boolean } };

export type UnsharePostMutationVariables = Exact<{
  postId: Scalars['String']['input'];
}>;


export type UnsharePostMutation = { __typename?: 'Mutation', unshare: { __typename?: 'ResponseEntity', success: boolean, message?: string | null, compl_data?: string | null } };

export type UpdatePostMutationVariables = Exact<{
  id: Scalars['String']['input'];
  content?: InputMaybe<Scalars['String']['input']>;
  medias?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
}>;


export type UpdatePostMutation = { __typename?: 'Mutation', updatePost: { __typename?: 'Post', id: string, content?: string | null, key?: string | null, createdAt: any, hasMedia: boolean, isShared: boolean, liked: boolean, shared: boolean, shares: number, likes: number, replies: number, actions?: Array<{ __typename?: 'Actions', createdAt: any, id?: string | null, type: string, author?: { __typename?: 'BaseUser', id: string, avatar?: string | null, name: string, username: string } | null }> | null, user: { __typename?: 'BaseUser', name: string, avatar?: string | null, id: string, username: string }, media?: Array<{ __typename?: 'Media', id: string, url: string }> | null, parent?: { __typename?: 'Parent', content?: string | null, hasMedia: boolean, createdAt: any, user: { __typename?: 'BaseUser', avatar?: string | null, id: string, name: string, username: string }, media?: Array<{ __typename?: 'Media', id: string, url: string }> | null } | null } };

export type UpdateReplyMutationVariables = Exact<{
  id: Scalars['String']['input'];
  content?: InputMaybe<Scalars['String']['input']>;
  medias?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
}>;


export type UpdateReplyMutation = { __typename?: 'Mutation', updateReply: { __typename?: 'Reply', id: string, content?: string | null, createdAt: any, likes: number, parentId?: string | null, postId: string, replies: number, liked: boolean, user: { __typename?: 'BaseUser', id: string, name: string, avatar?: string | null, username: string }, mentions?: Array<{ __typename?: 'BaseUser', id: string, name: string, avatar?: string | null, username: string }> | null, medias?: Array<{ __typename?: 'Media', id: string, replyId?: string | null, url: string, postId?: string | null }> | null } };

export type GetLikeByPostIdQueryVariables = Exact<{
  postId: Scalars['String']['input'];
  page: Scalars['Float']['input'];
}>;


export type GetLikeByPostIdQuery = { __typename?: 'Query', getLikeByPostId: { __typename?: 'LikeWithCount', count: number, like: Array<{ __typename?: 'BaseUser', id: string, username: string, avatar?: string | null, name: string }> } };

export type PostByIdQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type PostByIdQuery = { __typename?: 'Query', postById: { __typename?: 'Post', id: string, content?: string | null, key?: string | null, createdAt: any, updatedAt: any, hasMedia: boolean, isShared: boolean, liked: boolean, shared: boolean, shares: number, likes: number, replies: number, actions?: Array<{ __typename?: 'Actions', createdAt: any, id?: string | null, type: string, author?: { __typename?: 'BaseUser', id: string, avatar?: string | null, name: string, username: string } | null }> | null, user: { __typename?: 'BaseUser', name: string, avatar?: string | null, id: string, username: string }, media?: Array<{ __typename?: 'Media', id: string, url: string }> | null, parent?: { __typename?: 'Parent', id: string, content?: string | null, hasMedia: boolean, createdAt: any, updatedAt: any, user: { __typename?: 'BaseUser', avatar?: string | null, id: string, name: string, username: string }, media?: Array<{ __typename?: 'Media', id: string, url: string }> | null } | null } };

export type FindPostMediaByUserIdQueryVariables = Exact<{
  id: Scalars['String']['input'];
  page: Scalars['Float']['input'];
}>;


export type FindPostMediaByUserIdQuery = { __typename?: 'Query', findPostMediaByUserId: Array<{ __typename?: 'Post', id: string, content?: string | null, key?: string | null, createdAt: any, updatedAt: any, hasMedia: boolean, parentId?: string | null, isShared: boolean, liked: boolean, shared: boolean, shares: number, likes: number, replies: number, actions?: Array<{ __typename?: 'Actions', createdAt: any, id?: string | null, type: string, author?: { __typename?: 'BaseUser', id: string, avatar?: string | null, name: string, username: string } | null }> | null, user: { __typename?: 'BaseUser', name: string, avatar?: string | null, id: string, username: string }, media?: Array<{ __typename?: 'Media', id: string, url: string }> | null, parent?: { __typename?: 'Parent', id: string, content?: string | null, hasMedia: boolean, createdAt: any, updatedAt: any, user: { __typename?: 'BaseUser', avatar?: string | null, id: string, name: string, username: string }, media?: Array<{ __typename?: 'Media', id: string, url: string }> | null } | null }> };

export type GetPostByUserIdQueryVariables = Exact<{
  id: Scalars['String']['input'];
  page: Scalars['Float']['input'];
  getShare?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type GetPostByUserIdQuery = { __typename?: 'Query', getPostByUserId: Array<{ __typename?: 'Post', id: string, content?: string | null, key?: string | null, createdAt: any, updatedAt: any, hasMedia: boolean, parentId?: string | null, isShared: boolean, liked: boolean, shared: boolean, shares: number, likes: number, replies: number, actions?: Array<{ __typename?: 'Actions', createdAt: any, id?: string | null, type: string, author?: { __typename?: 'BaseUser', id: string, avatar?: string | null, name: string, username: string } | null }> | null, user: { __typename?: 'BaseUser', name: string, avatar?: string | null, id: string, username: string }, media?: Array<{ __typename?: 'Media', id: string, url: string }> | null, parent?: { __typename?: 'Parent', id: string, content?: string | null, hasMedia: boolean, createdAt: any, updatedAt: any, user: { __typename?: 'BaseUser', avatar?: string | null, id: string, name: string, username: string }, media?: Array<{ __typename?: 'Media', id: string, url: string }> | null } | null }> };

export type GetPostLikesByUserIdQueryVariables = Exact<{
  id: Scalars['String']['input'];
  page: Scalars['Float']['input'];
}>;


export type GetPostLikesByUserIdQuery = { __typename?: 'Query', getPostLikesByUserId: Array<{ __typename?: 'Post', id: string, content?: string | null, key?: string | null, createdAt: any, updatedAt: any, hasMedia: boolean, isShared: boolean, parentId?: string | null, liked: boolean, shared: boolean, shares: number, likes: number, replies: number, actions?: Array<{ __typename?: 'Actions', createdAt: any, id?: string | null, type: string, author?: { __typename?: 'BaseUser', id: string, avatar?: string | null, name: string, username: string } | null }> | null, user: { __typename?: 'BaseUser', name: string, avatar?: string | null, id: string, username: string }, media?: Array<{ __typename?: 'Media', id: string, url: string }> | null, parent?: { __typename?: 'Parent', id: string, content?: string | null, hasMedia: boolean, createdAt: any, updatedAt: any, user: { __typename?: 'BaseUser', avatar?: string | null, id: string, name: string, username: string }, media?: Array<{ __typename?: 'Media', id: string, url: string }> | null } | null }> };

export type RepliesQueryVariables = Exact<{
  postId: Scalars['String']['input'];
  page: Scalars['Float']['input'];
}>;


export type RepliesQuery = { __typename?: 'Query', replies: Array<{ __typename?: 'Reply', id: string, content?: string | null, likes: number, liked: boolean, parentId?: string | null, postId: string, createdAt: any, replies: number, user: { __typename?: 'BaseUser', avatar?: string | null, id: string, username: string, name: string }, medias?: Array<{ __typename?: 'Media', id: string, replyId?: string | null, url: string, postId?: string | null }> | null }> };

export type GetChildrenRepliesQueryVariables = Exact<{
  postId: Scalars['String']['input'];
  replyId: Scalars['String']['input'];
  page: Scalars['Float']['input'];
}>;


export type GetChildrenRepliesQuery = { __typename?: 'Query', getChildrenReplies: Array<{ __typename?: 'Reply', id: string, content?: string | null, likes: number, liked: boolean, parentId?: string | null, postId: string, createdAt: any, replies: number, mentions?: Array<{ __typename?: 'BaseUser', avatar?: string | null, id: string, username: string, name: string }> | null, user: { __typename?: 'BaseUser', avatar?: string | null, id: string, username: string, name: string } }> };

export type GetShareByPostIdQueryVariables = Exact<{
  postId: Scalars['String']['input'];
  page: Scalars['Float']['input'];
}>;


export type GetShareByPostIdQuery = { __typename?: 'Query', getShareByPostId: { __typename?: 'ShareListWithCount', count: number, share: Array<{ __typename?: 'ShareListEntity', id: string, user: { __typename?: 'BaseUser', avatar?: string | null, id: string, username: string, name: string } }> } };

export type SearchQueryVariables = Exact<{
  query: Scalars['String']['input'];
  page: Scalars['Float']['input'];
}>;


export type SearchQuery = { __typename?: 'Query', search: { __typename?: 'SearchResult', users?: Array<{ __typename?: 'BaseUser', id: string, name: string, username: string, avatar?: string | null, friendship?: { __typename?: 'Friendship', id: string, friendId: string, userId: string, status: FriendshipStatusEnum } | null }> | null, posts?: Array<{ __typename?: 'Post', id: string, content?: string | null, key?: string | null, createdAt: any, hasMedia: boolean, updatedAt: any, isShared: boolean, liked: boolean, shared: boolean, shares: number, likes: number, replies: number, actions?: Array<{ __typename?: 'Actions', createdAt: any, updatedAt: any, id?: string | null, type: string, author?: { __typename?: 'BaseUser', id: string, avatar?: string | null, name: string, username: string } | null }> | null, user: { __typename?: 'BaseUser', name: string, avatar?: string | null, id: string, username: string }, media?: Array<{ __typename?: 'Media', id: string, url: string }> | null, parent?: { __typename?: 'Parent', id: string, content?: string | null, hasMedia: boolean, createdAt: any, updatedAt: any, user: { __typename?: 'BaseUser', avatar?: string | null, id: string, name: string, username: string }, media?: Array<{ __typename?: 'Media', id: string, url: string }> | null } | null }> | null } };

export type SearchUsersQueryVariables = Exact<{
  query: Scalars['String']['input'];
  page: Scalars['Float']['input'];
}>;


export type SearchUsersQuery = { __typename?: 'Query', searchUsers: Array<{ __typename?: 'BaseUser', id: string, name: string, username: string, avatar?: string | null, friendship?: { __typename?: 'Friendship', id: string, friendId: string, userId: string, status: FriendshipStatusEnum } | null }> };

export type TimelineByCourseQueryVariables = Exact<{
  page: Scalars['Float']['input'];
}>;


export type TimelineByCourseQuery = { __typename?: 'Query', timelineByCourse: Array<{ __typename?: 'Post', id: string, content?: string | null, key?: string | null, createdAt: any, updatedAt: any, hasMedia: boolean, isShared: boolean, liked: boolean, shared: boolean, shares: number, likes: number, replies: number, parentId?: string | null, actions?: Array<{ __typename?: 'Actions', createdAt: any, updatedAt: any, id?: string | null, type: string, author?: { __typename?: 'BaseUser', id: string, avatar?: string | null, name: string, username: string } | null }> | null, user: { __typename?: 'BaseUser', name: string, avatar?: string | null, id: string, username: string }, media?: Array<{ __typename?: 'Media', id: string, url: string }> | null, parent?: { __typename?: 'Parent', id: string, content?: string | null, hasMedia: boolean, createdAt: any, updatedAt: any, user: { __typename?: 'BaseUser', avatar?: string | null, id: string, name: string, username: string }, media?: Array<{ __typename?: 'Media', id: string, url: string }> | null } | null }> };

export type TimelineQueryVariables = Exact<{
  page: Scalars['Float']['input'];
}>;


export type TimelineQuery = { __typename?: 'Query', timeline: Array<{ __typename?: 'Post', id: string, content?: string | null, key?: string | null, createdAt: any, updatedAt: any, hasMedia: boolean, isShared: boolean, liked: boolean, shared: boolean, shares: number, likes: number, parentId?: string | null, replies: number, actions?: Array<{ __typename?: 'Actions', createdAt: any, updatedAt: any, id?: string | null, type: string, author?: { __typename?: 'BaseUser', id: string, avatar?: string | null, name: string, username: string } | null }> | null, user: { __typename?: 'BaseUser', name: string, avatar?: string | null, id: string, username: string }, media?: Array<{ __typename?: 'Media', id: string, url: string }> | null, parent?: { __typename?: 'Parent', id: string, content?: string | null, hasMedia: boolean, createdAt: any, updatedAt: any, user: { __typename?: 'BaseUser', avatar?: string | null, id: string, name: string, username: string }, media?: Array<{ __typename?: 'Media', id: string, url: string }> | null } | null }> };

export type InvalidateTrackingMutationVariables = Exact<{ [key: string]: never; }>;


export type InvalidateTrackingMutation = { __typename?: 'Mutation', invalidateTracking: { __typename?: 'Tracking', id: string, latitude: number, longitude: number, building?: string | null, avatar?: string | null, name: string, username: string } };

export type SendTrackingDataMutationVariables = Exact<{
  latitude: Scalars['Float']['input'];
  longitude: Scalars['Float']['input'];
}>;


export type SendTrackingDataMutation = { __typename?: 'Mutation', sendTrackingData: { __typename?: 'Tracking', id: string, latitude: number, longitude: number, building?: string | null, avatar?: string | null, name: string, username: string } };

export type GetTrackingDataQueryVariables = Exact<{ [key: string]: never; }>;


export type GetTrackingDataQuery = { __typename?: 'Query', getTrackingData: Array<{ __typename?: 'Tracking', id: string, latitude: number, longitude: number, avatar?: string | null, name: string, username: string }> };

export type TrackingSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type TrackingSubscription = { __typename?: 'Subscription', tracking: { __typename?: 'Tracking', id: string, latitude: number, longitude: number, avatar?: string | null, name: string, username: string } };

export type GeneratePresignedUrlsMutationVariables = Exact<{
  data: Array<UrlRequestDto> | UrlRequestDto;
}>;


export type GeneratePresignedUrlsMutation = { __typename?: 'Mutation', generatePresignedUrls: Array<{ __typename?: 'PresignedUrl', filename: string, uploadUrl: string, fileUrl: string, type: string }> };

export type UpdateProfileMutationVariables = Exact<{
  data: UpdateProfileDto;
}>;


export type UpdateProfileMutation = { __typename?: 'Mutation', updateProfile: { __typename?: 'BaseUser', id: string, name: string, username: string, bio?: string | null, avatar?: string | null, banner?: string | null, course?: { __typename?: 'Course', id: string, name: string } | null } };

export type GetUserProfileQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type GetUserProfileQuery = { __typename?: 'Query', getUserProfile: { __typename?: 'BaseUser', avatar?: string | null, id: string, name: string, bio?: string | null, username: string, banner?: string | null, friendsCount?: number | null, course?: { __typename?: 'Course', name: string, id: string } | null, friendship?: { __typename?: 'Friendship', id: string, friendId: string, status: FriendshipStatusEnum } | null } };

export type GetUsersByIdQueryVariables = Exact<{
  ids: Array<Scalars['String']['input']> | Scalars['String']['input'];
  page: Scalars['Float']['input'];
}>;


export type GetUsersByIdQuery = { __typename?: 'Query', getUsersById: Array<{ __typename?: 'BaseUser', avatar?: string | null, id: string, name: string, username: string, friendship?: { __typename?: 'Friendship', id: string, friendId: string, userId: string, status: FriendshipStatusEnum } | null }> };

export type HeartbeatQueryVariables = Exact<{ [key: string]: never; }>;


export type HeartbeatQuery = { __typename?: 'Query', heartbeat: { __typename?: 'ResponseEntity', success: boolean, message?: string | null } };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', me: { __typename?: 'BaseUser', avatar?: string | null, id: string, name: string, username: string, banner?: string | null, bio?: string | null, course?: { __typename?: 'Course', id: string, name: string } | null } };

export type UserStatusSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type UserStatusSubscription = { __typename?: 'Subscription', userStatus: { __typename?: 'BaseUser', id: string } };


export const AddUserToAssignmentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"addUserToAssignment"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"assignmentId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"users"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addUserToAssignment"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"assignmentId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"assignmentId"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"usersIds"},"value":{"kind":"Variable","name":{"kind":"Name","value":"users"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]} as unknown as DocumentNode<AddUserToAssignmentMutation, AddUserToAssignmentMutationVariables>;
export const AddUsersToTaskDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"addUsersToTask"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"taskId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"users"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addUsersToTask"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"taskId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"taskId"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"userIds"},"value":{"kind":"Variable","name":{"kind":"Name","value":"users"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]} as unknown as DocumentNode<AddUsersToTaskMutation, AddUsersToTaskMutationVariables>;
export const CreateAssignmentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createAssignment"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"icon"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"users"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createAssignment"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"icon"},"value":{"kind":"Variable","name":{"kind":"Name","value":"icon"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"usersIds"},"value":{"kind":"Variable","name":{"kind":"Name","value":"users"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"ownerId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]} as unknown as DocumentNode<CreateAssignmentMutation, CreateAssignmentMutationVariables>;
export const CreateAssignmentTaskDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createAssignmentTask"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"assignmentId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"dueDate"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DateTime"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"users"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"description"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createAssignmentTask"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"assignmentId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"assignmentId"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"users"},"value":{"kind":"Variable","name":{"kind":"Name","value":"users"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"dueDate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"dueDate"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"description"},"value":{"kind":"Variable","name":{"kind":"Name","value":"description"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"assignmentId"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"dueDate"}}]}}]}}]} as unknown as DocumentNode<CreateAssignmentTaskMutation, CreateAssignmentTaskMutationVariables>;
export const DeleteAssignmentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"deleteAssignment"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"assignmentId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteAssignment"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"assignmentId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"assignmentId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]} as unknown as DocumentNode<DeleteAssignmentMutation, DeleteAssignmentMutationVariables>;
export const DeleteFileDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"deleteFile"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"taskId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"fileUrl"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteFile"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"taskId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"taskId"}}},{"kind":"Argument","name":{"kind":"Name","value":"fileUrl"},"value":{"kind":"Variable","name":{"kind":"Name","value":"fileUrl"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]} as unknown as DocumentNode<DeleteFileMutation, DeleteFileMutationVariables>;
export const DeleteAssignmentTaskDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"deleteAssignmentTask"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"taskId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteAssignmentTask"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"taskId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"taskId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]} as unknown as DocumentNode<DeleteAssignmentTaskMutation, DeleteAssignmentTaskMutationVariables>;
export const LeaveAssignmentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"leaveAssignment"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"assignmentId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"leaveAssignment"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"assignmentId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"assignmentId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]} as unknown as DocumentNode<LeaveAssignmentMutation, LeaveAssignmentMutationVariables>;
export const LeaveTaskDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"leaveTask"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"taskId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"leaveTask"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"taskId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"taskId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]} as unknown as DocumentNode<LeaveTaskMutation, LeaveTaskMutationVariables>;
export const LinkChatToAssignmentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"linkChatToAssignment"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"assignmentId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"chatId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"linkChatToAssignment"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"assignmentId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"assignmentId"}}},{"kind":"Argument","name":{"kind":"Name","value":"chatId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"chatId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]} as unknown as DocumentNode<LinkChatToAssignmentMutation, LinkChatToAssignmentMutationVariables>;
export const RemoveUserFromAssignmentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"removeUserFromAssignment"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"assignmentId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"removeUserFromAssignment"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"assignmentId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"assignmentId"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"userIdToRemove"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]} as unknown as DocumentNode<RemoveUserFromAssignmentMutation, RemoveUserFromAssignmentMutationVariables>;
export const RemoveUsersFromTaskDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"removeUsersFromTask"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"taskId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userIds"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"removeUsersFromTask"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"taskId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"taskId"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"userIds"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userIds"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]} as unknown as DocumentNode<RemoveUsersFromTaskMutation, RemoveUsersFromTaskMutationVariables>;
export const SearchFilesByUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"searchFilesByUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"taskId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"query"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"searchFilesByUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}},{"kind":"Argument","name":{"kind":"Name","value":"taskId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"taskId"}}},{"kind":"Argument","name":{"kind":"Name","value":"query"},"value":{"kind":"Variable","name":{"kind":"Name","value":"query"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"files"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"filename"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<SearchFilesByUserMutation, SearchFilesByUserMutationVariables>;
export const TagTaskAsCompletedDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"tagTaskAsCompleted"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"taskId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"tagTaskAsCompleted"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"taskId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"taskId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]} as unknown as DocumentNode<TagTaskAsCompletedMutation, TagTaskAsCompletedMutationVariables>;
export const TransferAssignmentOwnershipDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"transferAssignmentOwnership"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"assignmentId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"transferAssignmentOwnership"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"assignmentId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"assignmentId"}}},{"kind":"Argument","name":{"kind":"Name","value":"userId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]} as unknown as DocumentNode<TransferAssignmentOwnershipMutation, TransferAssignmentOwnershipMutationVariables>;
export const UnlinkChatAndAssignmentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"unlinkChatAndAssignment"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"assignmentId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"chatId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"unlinkChatAndAssignment"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"assignmentId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"assignmentId"}}},{"kind":"Argument","name":{"kind":"Name","value":"chatId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"chatId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]} as unknown as DocumentNode<UnlinkChatAndAssignmentMutation, UnlinkChatAndAssignmentMutationVariables>;
export const UpdateAssignmentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateAssignment"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"icon"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"assignmentId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateAssignment"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"icon"},"value":{"kind":"Variable","name":{"kind":"Name","value":"icon"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"assignmentId"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"ownerId"}}]}}]}}]} as unknown as DocumentNode<UpdateAssignmentMutation, UpdateAssignmentMutationVariables>;
export const UpdateAssignmentTaskDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateAssignmentTask"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"taskId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"dueDate"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"DateTime"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"description"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateAssignmentTask"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"taskId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"taskId"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"dueDate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"dueDate"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"description"},"value":{"kind":"Variable","name":{"kind":"Name","value":"description"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"assignmentId"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"dueDate"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<UpdateAssignmentTaskMutation, UpdateAssignmentTaskMutationVariables>;
export const UpdateUserRoleInAssignmentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateUserRoleInAssignment"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"isAdmin"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"assignmentId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateUserRoleInAssignment"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"userId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"assignmentId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"assignmentId"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"isAdmin"},"value":{"kind":"Variable","name":{"kind":"Name","value":"isAdmin"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode<UpdateUserRoleInAssignmentMutation, UpdateUserRoleInAssignmentMutationVariables>;
export const UploadFilesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"uploadFiles"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UploadFileToTaskDTO"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uploadFiles"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]} as unknown as DocumentNode<UploadFilesMutation, UploadFilesMutationVariables>;
export const CanNavigateBetweenAssignmentAndChatDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"canNavigateBetweenAssignmentAndChat"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"assignmentId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"chatId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"canNavigateBetweenAssignmentAndChat"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"assignmentId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"assignmentId"}}},{"kind":"Argument","name":{"kind":"Name","value":"chatId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"chatId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode<CanNavigateBetweenAssignmentAndChatQuery, CanNavigateBetweenAssignmentAndChatQueryVariables>;
export const GetAddableUsersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getAddableUsers"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"assignmentId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"taskId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getAddableUsers"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"assignmentId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"assignmentId"}}},{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}},{"kind":"Argument","name":{"kind":"Name","value":"taskId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"taskId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"letter"}},{"kind":"Field","name":{"kind":"Name","value":"friends"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"isMember"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}},{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}}]} as unknown as DocumentNode<GetAddableUsersQuery, GetAddableUsersQueryVariables>;
export const GetAllFilesByTaskIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getAllFilesByTaskId"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"taskId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getAllFilesByTaskId"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}},{"kind":"Argument","name":{"kind":"Name","value":"taskId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"taskId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"files"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"filename"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<GetAllFilesByTaskIdQuery, GetAllFilesByTaskIdQueryVariables>;
export const GetAllTasksByAssignmentIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getAllTasksByAssignmentId"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"assignmentId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getAllTasksByAssignmentId"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"assignmentId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"assignmentId"}}},{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dueDate"}},{"kind":"Field","name":{"kind":"Name","value":"item"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"isPending"}},{"kind":"Field","name":{"kind":"Name","value":"dueDate"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}}]}}]}}]} as unknown as DocumentNode<GetAllTasksByAssignmentIdQuery, GetAllTasksByAssignmentIdQueryVariables>;
export const GetAssignmentByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getAssignmentById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"assignmentId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getAssignmentById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"assignmentId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"assignmentId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"ownerId"}},{"kind":"Field","name":{"kind":"Name","value":"isAdmin"}},{"kind":"Field","name":{"kind":"Name","value":"chatId"}}]}}]}}]} as unknown as DocumentNode<GetAssignmentByIdQuery, GetAssignmentByIdQueryVariables>;
export const GetAssignmentFriendsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getAssignmentFriends"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"assignmentId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getAssignmentFriends"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"assignmentId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"assignmentId"}}},{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}},{"kind":"Field","name":{"kind":"Name","value":"count"}},{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"friends"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"isMember"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"username"}}]}},{"kind":"Field","name":{"kind":"Name","value":"letter"}}]}}]}}]}}]} as unknown as DocumentNode<GetAssignmentFriendsQuery, GetAssignmentFriendsQueryVariables>;
export const GetAssignmentUsersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getAssignmentUsers"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"assignmentId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getAssignmentUsers"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"assignmentId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"assignmentId"}}},{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"isAdmin"}},{"kind":"Field","name":{"kind":"Name","value":"assignmentId"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}}]}}]}}]} as unknown as DocumentNode<GetAssignmentUsersQuery, GetAssignmentUsersQueryVariables>;
export const GetAssignmentsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getAssignments"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getAssignments"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dueDate"}},{"kind":"Field","name":{"kind":"Name","value":"item"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dueDate"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"isPending"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"pendingCount"}}]}}]}}]}}]} as unknown as DocumentNode<GetAssignmentsQuery, GetAssignmentsQueryVariables>;
export const GetCategorizedTaskUsersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getCategorizedTaskUsers"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"assignmentId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getCategorizedTaskUsers"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"assignmentId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"assignmentId"}}},{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"letter"}},{"kind":"Field","name":{"kind":"Name","value":"friends"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"isMember"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}}]}}]}}]} as unknown as DocumentNode<GetCategorizedTaskUsersQuery, GetCategorizedTaskUsersQueryVariables>;
export const GetLinkableChatsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getLinkableChats"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"assignmentId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getLinkableChats"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"assignmentId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"assignmentId"}}},{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"icon"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<GetLinkableChatsQuery, GetLinkableChatsQueryVariables>;
export const GetTaskDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getTask"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"taskId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getTask"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"taskId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"taskId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"files"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"filename"}}]}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"assignmentId"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"dueDate"}},{"kind":"Field","name":{"kind":"Name","value":"completed"}},{"kind":"Field","name":{"kind":"Name","value":"isMember"}},{"kind":"Field","name":{"kind":"Name","value":"totalCount"}},{"kind":"Field","name":{"kind":"Name","value":"completedCount"}},{"kind":"Field","name":{"kind":"Name","value":"ownerId"}}]}}]}}]} as unknown as DocumentNode<GetTaskQuery, GetTaskQueryVariables>;
export const GetTaskMembersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getTaskMembers"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"taskId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getTaskMembers"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"taskId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"taskId"}}},{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"completed"}}]}}]}}]} as unknown as DocumentNode<GetTaskMembersQuery, GetTaskMembersQueryVariables>;
export const GetUsersTaskByAssignmentIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getUsersTaskByAssignmentId"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"assignmentId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getUsersTaskByAssignmentId"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"assignmentId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"assignmentId"}}},{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dueDate"}},{"kind":"Field","name":{"kind":"Name","value":"item"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"isPending"}},{"kind":"Field","name":{"kind":"Name","value":"dueDate"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}}]}}]}}]} as unknown as DocumentNode<GetUsersTaskByAssignmentIdQuery, GetUsersTaskByAssignmentIdQueryVariables>;
export const SearchAddableUsersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"searchAddableUsers"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"assignmentId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"taskId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"query"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"searchAddableUsers"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"assignmentId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"assignmentId"}}},{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}},{"kind":"Argument","name":{"kind":"Name","value":"taskId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"taskId"}}},{"kind":"Argument","name":{"kind":"Name","value":"query"},"value":{"kind":"Variable","name":{"kind":"Name","value":"query"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"letter"}},{"kind":"Field","name":{"kind":"Name","value":"friends"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"isMember"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}}]}}]}}]} as unknown as DocumentNode<SearchAddableUsersQuery, SearchAddableUsersQueryVariables>;
export const SearchAssignmentFriendsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"searchAssignmentFriends"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"assignmentId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"query"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"searchAssignmentFriends"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"assignmentId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"assignmentId"}}},{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}},{"kind":"Argument","name":{"kind":"Name","value":"query"},"value":{"kind":"Variable","name":{"kind":"Name","value":"query"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}},{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"friends"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"isMember"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"username"}}]}},{"kind":"Field","name":{"kind":"Name","value":"letter"}}]}}]}}]}}]} as unknown as DocumentNode<SearchAssignmentFriendsQuery, SearchAssignmentFriendsQueryVariables>;
export const AssignmentMemberDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"assignmentMember"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"assignmentId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"assignmentMember"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"assignmentId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"assignmentId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"assignment"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"chatId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"ownerId"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}}]}},{"kind":"Field","name":{"kind":"Name","value":"member"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}}]}},{"kind":"Field","name":{"kind":"Name","value":"isAdmin"}}]}},{"kind":"Field","name":{"kind":"Name","value":"action"}}]}}]}}]} as unknown as DocumentNode<AssignmentMemberSubscription, AssignmentMemberSubscriptionVariables>;
export const AssignmentsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"assignments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"assignments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"assignment"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"ownerId"}},{"kind":"Field","name":{"kind":"Name","value":"chatId"}},{"kind":"Field","name":{"kind":"Name","value":"isAdmin"}}]}},{"kind":"Field","name":{"kind":"Name","value":"member"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"isAdmin"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"username"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"action"}}]}}]}}]} as unknown as DocumentNode<AssignmentsSubscription, AssignmentsSubscriptionVariables>;
export const TasksDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"tasks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"tasks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"assignment"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"ownerId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"task"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"dueDate"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}},{"kind":"Field","name":{"kind":"Name","value":"action"}},{"kind":"Field","name":{"kind":"Name","value":"ids"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<TasksSubscription, TasksSubscriptionVariables>;
export const SigninDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"signin"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"password"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"signin"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"password"},"value":{"kind":"Variable","name":{"kind":"Name","value":"password"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"token"}},{"kind":"Field","name":{"kind":"Name","value":"refreshToken"}}]}}]}}]} as unknown as DocumentNode<SigninMutation, SigninMutationVariables>;
export const SignupDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"signup"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SignupDTO"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"signup"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode<SignupMutation, SignupMutationVariables>;
export const RefreshTokenDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"refreshToken"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"refreshToken"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"refreshToken"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"refreshToken"},"value":{"kind":"Variable","name":{"kind":"Name","value":"refreshToken"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"token"}},{"kind":"Field","name":{"kind":"Name","value":"refreshToken"}}]}}]}}]} as unknown as DocumentNode<RefreshTokenQuery, RefreshTokenQueryVariables>;
export const AddUserToChatDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"addUserToChat"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"chatId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"users"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addUserToChat"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"chatId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"chatId"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"userToAddId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"users"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"isDirect"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}}]}}]}}]} as unknown as DocumentNode<AddUserToChatMutation, AddUserToChatMutationVariables>;
export const ChangeUserRoleDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"changeUserRole"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"chatId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"isAdmin"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"changeUserRole"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"chatId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"chatId"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"userToUpdateId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"isAdmin"},"value":{"kind":"Variable","name":{"kind":"Name","value":"isAdmin"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]} as unknown as DocumentNode<ChangeUserRoleMutation, ChangeUserRoleMutationVariables>;
export const CreateChatDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createChat"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"icon"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"users"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"type"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ChatType"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"isDirect"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createChat"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"icon"},"value":{"kind":"Variable","name":{"kind":"Name","value":"icon"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"users"},"value":{"kind":"Variable","name":{"kind":"Name","value":"users"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"type"},"value":{"kind":"Variable","name":{"kind":"Name","value":"type"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"isDirect"},"value":{"kind":"Variable","name":{"kind":"Name","value":"isDirect"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"isDirect"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"isOnline"}}]}}]}}]} as unknown as DocumentNode<CreateChatMutation, CreateChatMutationVariables>;
export const LeaveChatDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"leaveChat"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"chatId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"user"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"leaveChat"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"chatId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"chatId"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"userToRemoveId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"user"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"isDirect"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}}]}}]}}]} as unknown as DocumentNode<LeaveChatMutation, LeaveChatMutationVariables>;
export const RemoveUserFromChatDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"removeUserFromChat"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"chatId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"user"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"removeUserFromChat"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"chatId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"chatId"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"userToRemoveId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"user"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"isDirect"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}},{"kind":"Field","name":{"kind":"Name","value":"isAdmin"}}]}}]}}]} as unknown as DocumentNode<RemoveUserFromChatMutation, RemoveUserFromChatMutationVariables>;
export const SearchChatFriendsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"searchChatFriends"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"chatId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"query"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"searchChatFriends"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"chatId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"chatId"}}},{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}},{"kind":"Argument","name":{"kind":"Name","value":"query"},"value":{"kind":"Variable","name":{"kind":"Name","value":"query"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}},{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"friends"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"isMember"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"username"}}]}},{"kind":"Field","name":{"kind":"Name","value":"letter"}}]}}]}}]}}]} as unknown as DocumentNode<SearchChatFriendsMutation, SearchChatFriendsMutationVariables>;
export const TransferOwnershipDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"transferOwnership"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"chatId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"newOwnerId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"transferOwnership"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"chatId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"chatId"}}},{"kind":"Argument","name":{"kind":"Name","value":"userId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"newOwnerId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"isDirect"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"isOnline"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}},{"kind":"Field","name":{"kind":"Name","value":"isAdmin"}},{"kind":"Field","name":{"kind":"Name","value":"ownerId"}}]}}]}}]} as unknown as DocumentNode<TransferOwnershipMutation, TransferOwnershipMutationVariables>;
export const UpdateChatSettingsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateChatSettings"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"icon"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"chatId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"type"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ChatType"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateChatSettings"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"icon"},"value":{"kind":"Variable","name":{"kind":"Name","value":"icon"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"chatId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"chatId"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"type"},"value":{"kind":"Variable","name":{"kind":"Name","value":"type"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"isDirect"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"isOnline"}},{"kind":"Field","name":{"kind":"Name","value":"isAdmin"}}]}}]}}]} as unknown as DocumentNode<UpdateChatSettingsMutation, UpdateChatSettingsMutationVariables>;
export const GetAllChatsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getAllChats"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getAllChats"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"chat"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"isDirect"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}},{"kind":"Field","name":{"kind":"Name","value":"unreadMessages"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"isOnline"}},{"kind":"Field","name":{"kind":"Name","value":"directUserMember"}}]}},{"kind":"Field","name":{"kind":"Name","value":"message"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"hasMedia"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}},{"kind":"Field","name":{"kind":"Name","value":"media"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"messageStatus"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"messageId"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}},{"kind":"Field","name":{"kind":"Name","value":"userId"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"chatAction"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"action"}},{"kind":"Field","name":{"kind":"Name","value":"actionAuthor"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"username"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"chatId"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<GetAllChatsQuery, GetAllChatsQueryVariables>;
export const GetChatByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getChatById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"chatId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getChatById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"chatId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"chatId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"isDirect"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"isOnline"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}},{"kind":"Field","name":{"kind":"Name","value":"isAdmin"}},{"kind":"Field","name":{"kind":"Name","value":"ownerId"}},{"kind":"Field","name":{"kind":"Name","value":"directUserMember"}}]}}]}}]} as unknown as DocumentNode<GetChatByIdQuery, GetChatByIdQueryVariables>;
export const GetChatByUserMemberDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getChatByUserMember"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getChatByUserMember"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"userId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"isDirect"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"isOnline"}}]}}]}}]} as unknown as DocumentNode<GetChatByUserMemberQuery, GetChatByUserMemberQueryVariables>;
export const GetChatFriendsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getChatFriends"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"chatId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getChatFriends"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"chatId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"chatId"}}},{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}},{"kind":"Field","name":{"kind":"Name","value":"count"}},{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"friends"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"isMember"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"username"}}]}},{"kind":"Field","name":{"kind":"Name","value":"letter"}}]}}]}}]}}]} as unknown as DocumentNode<GetChatFriendsQuery, GetChatFriendsQueryVariables>;
export const GetChatMembersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getChatMembers"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"chatId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getChatMembers"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"chatId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"chatId"}}},{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"isAdmin"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"username"}}]}}]}}]}}]} as unknown as DocumentNode<GetChatMembersQuery, GetChatMembersQueryVariables>;
export const ActiveChatDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"activeChat"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"chatId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"activeChat"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"chatId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"chatId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"chat"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"isDirect"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"unreadMessages"}},{"kind":"Field","name":{"kind":"Name","value":"ownerId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"isAdmin"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}}]}},{"kind":"Field","name":{"kind":"Name","value":"message"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"deletedAt"}},{"kind":"Field","name":{"kind":"Name","value":"hasMedia"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}},{"kind":"Field","name":{"kind":"Name","value":"media"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"messageStatus"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"messageId"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}},{"kind":"Field","name":{"kind":"Name","value":"userId"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"chatAction"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"action"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"action"}},{"kind":"Field","name":{"kind":"Name","value":"actionAuthor"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"isAdmin"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]}}]} as unknown as DocumentNode<ActiveChatSubscription, ActiveChatSubscriptionVariables>;
export const ChatsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"chats"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"chats"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"chat"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"isDirect"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"unreadMessages"}},{"kind":"Field","name":{"kind":"Name","value":"ownerId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}}]}},{"kind":"Field","name":{"kind":"Name","value":"message"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"deletedAt"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"hasMedia"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}},{"kind":"Field","name":{"kind":"Name","value":"media"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"messageStatus"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"messageId"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}},{"kind":"Field","name":{"kind":"Name","value":"userId"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"chatAction"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"action"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"actionAuthor"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"username"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"chatId"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<ChatsSubscription, ChatsSubscriptionVariables>;
export const GetCoursesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getCourses"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getCourses"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<GetCoursesQuery, GetCoursesQueryVariables>;
export const AcceptFriendshipDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"acceptFriendship"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"friendshipId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"acceptFriendship"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"friendshipId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"compl_data"}}]}}]}}]} as unknown as DocumentNode<AcceptFriendshipMutation, AcceptFriendshipMutationVariables>;
export const CreateFriendshipDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createFriendship"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"friendId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createFriendship"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"friendId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"friendId"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"compl_data"}}]}}]}}]} as unknown as DocumentNode<CreateFriendshipMutation, CreateFriendshipMutationVariables>;
export const DeleteFriendshipDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"deleteFriendship"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"friendshipId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteFriendship"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"friendshipId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"compl_data"}}]}}]}}]} as unknown as DocumentNode<DeleteFriendshipMutation, DeleteFriendshipMutationVariables>;
export const GetAllFriendsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getAllFriends"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getAllFriends"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}}]}}]} as unknown as DocumentNode<GetAllFriendsQuery, GetAllFriendsQueryVariables>;
export const GetAllFriendsAlphabeticallyDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getAllFriendsAlphabetically"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getAllFriendsAlphabetically"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"}},{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}}]}}]}}]} as unknown as DocumentNode<GetAllFriendsAlphabeticallyQuery, GetAllFriendsAlphabeticallyQueryVariables>;
export const GetFriendRequestStatusDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getFriendRequestStatus"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getFriendRequestStatus"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}]}}]} as unknown as DocumentNode<GetFriendRequestStatusQuery, GetFriendRequestStatusQueryVariables>;
export const GetAllOnlineFriendsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getAllOnlineFriends"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getAllOnlineFriends"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}}]}}]} as unknown as DocumentNode<GetAllOnlineFriendsQuery, GetAllOnlineFriendsQueryVariables>;
export const SearchFriendsAlphabeticallyDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"searchFriendsAlphabetically"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"value"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"searchFriendsAlphabetically"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}},{"kind":"Argument","name":{"kind":"Name","value":"value"},"value":{"kind":"Variable","name":{"kind":"Name","value":"value"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"}},{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}}]}}]}}]} as unknown as DocumentNode<SearchFriendsAlphabeticallyMutation, SearchFriendsAlphabeticallyMutationVariables>;
export const FriendStatusDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"friendStatus"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"friendStatus"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"online"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"username"}}]}}]}}]} as unknown as DocumentNode<FriendStatusSubscription, FriendStatusSubscriptionVariables>;
export const GetMentionableUsersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getMentionableUsers"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"content"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getMentionableUsers"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"content"},"value":{"kind":"Variable","name":{"kind":"Name","value":"content"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}}]}}]} as unknown as DocumentNode<GetMentionableUsersQuery, GetMentionableUsersQueryVariables>;
export const DeleteMessageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"deleteMessage"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"messageId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"chatId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteMessage"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"messageId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"messageId"}}},{"kind":"Argument","name":{"kind":"Name","value":"chatId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"chatId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]} as unknown as DocumentNode<DeleteMessageMutation, DeleteMessageMutationVariables>;
export const SendMessageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"sendMessage"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"content"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"chatId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"medias"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"sendMessage"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"content"},"value":{"kind":"Variable","name":{"kind":"Name","value":"content"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"medias"},"value":{"kind":"Variable","name":{"kind":"Name","value":"medias"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"chatId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"chatId"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"deletedAt"}},{"kind":"Field","name":{"kind":"Name","value":"hasMedia"}},{"kind":"Field","name":{"kind":"Name","value":"media"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"messageId"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<SendMessageMutation, SendMessageMutationVariables>;
export const GetChatMessagesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getChatMessages"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"chatId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getChatMessages"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"chatId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"chatId"}}},{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"system"}},{"kind":"Field","name":{"kind":"Name","value":"message"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"hasMedia"}},{"kind":"Field","name":{"kind":"Name","value":"media"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"urls"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"author"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"action"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"action"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]} as unknown as DocumentNode<GetChatMessagesQuery, GetChatMessagesQueryVariables>;
export const UpdateMessagesStatusDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateMessagesStatus"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"chatId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateMessagesStatus"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"chatId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"chatId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode<UpdateMessagesStatusMutation, UpdateMessagesStatusMutationVariables>;
export const GetFriendRequestsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getFriendRequests"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getFriendRequests"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"postId"}},{"kind":"Field","name":{"kind":"Name","value":"replyId"}},{"kind":"Field","name":{"kind":"Name","value":"friendshipId"}},{"kind":"Field","name":{"kind":"Name","value":"emitters"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"type"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"post"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"mentions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"username"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"reply"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"mentions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"username"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetFriendRequestsQuery, GetFriendRequestsQueryVariables>;
export const GetNotificationsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getNotifications"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getNotifications"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"postId"}},{"kind":"Field","name":{"kind":"Name","value":"replyId"}},{"kind":"Field","name":{"kind":"Name","value":"assignmentId"}},{"kind":"Field","name":{"kind":"Name","value":"taskId"}},{"kind":"Field","name":{"kind":"Name","value":"friendshipId"}},{"kind":"Field","name":{"kind":"Name","value":"emitters"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"type"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"post"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"mentions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"username"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"reply"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"mentions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"username"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetNotificationsQuery, GetNotificationsQueryVariables>;
export const UnreadNotificationsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"unreadNotifications"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"unreadNotifications"}}]}}]} as unknown as DocumentNode<UnreadNotificationsQuery, UnreadNotificationsQueryVariables>;
export const NotificationsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"notifications"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"notifications"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"postId"}},{"kind":"Field","name":{"kind":"Name","value":"replyId"}},{"kind":"Field","name":{"kind":"Name","value":"friendshipId"}},{"kind":"Field","name":{"kind":"Name","value":"emitters"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"type"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"post"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"mentions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"username"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"reply"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"mentions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"username"}}]}}]}}]}}]}}]} as unknown as DocumentNode<NotificationsSubscription, NotificationsSubscriptionVariables>;
export const CreatePostDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createPost"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"content"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"medias"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createPost"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"content"},"value":{"kind":"Variable","name":{"kind":"Name","value":"content"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"medias"},"value":{"kind":"Variable","name":{"kind":"Name","value":"medias"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"actions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"author"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"username"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"hasMedia"}},{"kind":"Field","name":{"kind":"Name","value":"isShared"}},{"kind":"Field","name":{"kind":"Name","value":"liked"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}}]}},{"kind":"Field","name":{"kind":"Name","value":"media"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"shared"}},{"kind":"Field","name":{"kind":"Name","value":"shares"}},{"kind":"Field","name":{"kind":"Name","value":"likes"}},{"kind":"Field","name":{"kind":"Name","value":"replies"}},{"kind":"Field","name":{"kind":"Name","value":"parent"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"username"}}]}},{"kind":"Field","name":{"kind":"Name","value":"hasMedia"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"media"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}}]}}]} as unknown as DocumentNode<CreatePostMutation, CreatePostMutationVariables>;
export const CreateReplyDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createReply"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"content"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"medias"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"postId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"parentId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createReply"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"content"},"value":{"kind":"Variable","name":{"kind":"Name","value":"content"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"medias"},"value":{"kind":"Variable","name":{"kind":"Name","value":"medias"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"postId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"postId"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"parentId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"parentId"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"username"}}]}},{"kind":"Field","name":{"kind":"Name","value":"likes"}},{"kind":"Field","name":{"kind":"Name","value":"parentId"}},{"kind":"Field","name":{"kind":"Name","value":"postId"}},{"kind":"Field","name":{"kind":"Name","value":"mentions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"username"}}]}},{"kind":"Field","name":{"kind":"Name","value":"replies"}},{"kind":"Field","name":{"kind":"Name","value":"liked"}},{"kind":"Field","name":{"kind":"Name","value":"medias"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"replyId"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"postId"}}]}}]}}]}}]} as unknown as DocumentNode<CreateReplyMutation, CreateReplyMutationVariables>;
export const DeleteReplyDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"deleteReply"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteReply"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode<DeleteReplyMutation, DeleteReplyMutationVariables>;
export const LikePostDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"likePost"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"postId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"likePost"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"postId"}}},{"kind":"Argument","name":{"kind":"Name","value":"entity"},"value":{"kind":"StringValue","value":"POST","block":false}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode<LikePostMutation, LikePostMutationVariables>;
export const LikeReplyDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"likeReply"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"replyId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"likePost"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"replyId"}}},{"kind":"Argument","name":{"kind":"Name","value":"entity"},"value":{"kind":"StringValue","value":"REPLY","block":false}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode<LikeReplyMutation, LikeReplyMutationVariables>;
export const RemovePostDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"removePost"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"removePost"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<RemovePostMutation, RemovePostMutationVariables>;
export const SharePostDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"sharePost"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"content"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"medias"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"parentId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"share"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"content"},"value":{"kind":"Variable","name":{"kind":"Name","value":"content"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"medias"},"value":{"kind":"Variable","name":{"kind":"Name","value":"medias"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"parentId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"parentId"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"actions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"author"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"username"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"hasMedia"}},{"kind":"Field","name":{"kind":"Name","value":"isShared"}},{"kind":"Field","name":{"kind":"Name","value":"liked"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}}]}},{"kind":"Field","name":{"kind":"Name","value":"media"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"shared"}},{"kind":"Field","name":{"kind":"Name","value":"shares"}},{"kind":"Field","name":{"kind":"Name","value":"likes"}},{"kind":"Field","name":{"kind":"Name","value":"replies"}},{"kind":"Field","name":{"kind":"Name","value":"parent"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"username"}}]}},{"kind":"Field","name":{"kind":"Name","value":"hasMedia"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"media"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}}]}}]} as unknown as DocumentNode<SharePostMutation, SharePostMutationVariables>;
export const UnlikePostDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"unlikePost"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"postId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"unlikePost"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"postId"}}},{"kind":"Argument","name":{"kind":"Name","value":"entity"},"value":{"kind":"StringValue","value":"POST","block":false}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode<UnlikePostMutation, UnlikePostMutationVariables>;
export const UnlikeReplyDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"unlikeReply"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"replyId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"unlikePost"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"replyId"}}},{"kind":"Argument","name":{"kind":"Name","value":"entity"},"value":{"kind":"StringValue","value":"REPLY","block":false}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode<UnlikeReplyMutation, UnlikeReplyMutationVariables>;
export const UnsharePostDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"unsharePost"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"postId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"unshare"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"postId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"postId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"compl_data"}}]}}]}}]} as unknown as DocumentNode<UnsharePostMutation, UnsharePostMutationVariables>;
export const UpdatePostDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updatePost"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"content"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"medias"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updatePost"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"updatePost"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"content"},"value":{"kind":"Variable","name":{"kind":"Name","value":"content"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"medias"},"value":{"kind":"Variable","name":{"kind":"Name","value":"medias"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"actions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"author"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"username"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"hasMedia"}},{"kind":"Field","name":{"kind":"Name","value":"isShared"}},{"kind":"Field","name":{"kind":"Name","value":"liked"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}}]}},{"kind":"Field","name":{"kind":"Name","value":"media"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"shared"}},{"kind":"Field","name":{"kind":"Name","value":"shares"}},{"kind":"Field","name":{"kind":"Name","value":"likes"}},{"kind":"Field","name":{"kind":"Name","value":"replies"}},{"kind":"Field","name":{"kind":"Name","value":"parent"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"username"}}]}},{"kind":"Field","name":{"kind":"Name","value":"hasMedia"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"media"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}}]}}]} as unknown as DocumentNode<UpdatePostMutation, UpdatePostMutationVariables>;
export const UpdateReplyDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateReply"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"content"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"medias"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateReply"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"content"},"value":{"kind":"Variable","name":{"kind":"Name","value":"content"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"medias"},"value":{"kind":"Variable","name":{"kind":"Name","value":"medias"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"username"}}]}},{"kind":"Field","name":{"kind":"Name","value":"likes"}},{"kind":"Field","name":{"kind":"Name","value":"parentId"}},{"kind":"Field","name":{"kind":"Name","value":"postId"}},{"kind":"Field","name":{"kind":"Name","value":"mentions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"username"}}]}},{"kind":"Field","name":{"kind":"Name","value":"medias"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"replyId"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"postId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"replies"}},{"kind":"Field","name":{"kind":"Name","value":"liked"}}]}}]}}]} as unknown as DocumentNode<UpdateReplyMutation, UpdateReplyMutationVariables>;
export const GetLikeByPostIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getLikeByPostId"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"postId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getLikeByPostId"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"postId"}}},{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"like"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}}]} as unknown as DocumentNode<GetLikeByPostIdQuery, GetLikeByPostIdQueryVariables>;
export const PostByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"postById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"postById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"actions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"author"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"username"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"hasMedia"}},{"kind":"Field","name":{"kind":"Name","value":"isShared"}},{"kind":"Field","name":{"kind":"Name","value":"liked"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}}]}},{"kind":"Field","name":{"kind":"Name","value":"media"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"shared"}},{"kind":"Field","name":{"kind":"Name","value":"shares"}},{"kind":"Field","name":{"kind":"Name","value":"likes"}},{"kind":"Field","name":{"kind":"Name","value":"replies"}},{"kind":"Field","name":{"kind":"Name","value":"parent"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"username"}}]}},{"kind":"Field","name":{"kind":"Name","value":"hasMedia"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"media"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}}]}}]} as unknown as DocumentNode<PostByIdQuery, PostByIdQueryVariables>;
export const FindPostMediaByUserIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"findPostMediaByUserId"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"findPostMediaByUserId"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"actions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"author"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"username"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"hasMedia"}},{"kind":"Field","name":{"kind":"Name","value":"parentId"}},{"kind":"Field","name":{"kind":"Name","value":"isShared"}},{"kind":"Field","name":{"kind":"Name","value":"liked"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}}]}},{"kind":"Field","name":{"kind":"Name","value":"media"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"shared"}},{"kind":"Field","name":{"kind":"Name","value":"shares"}},{"kind":"Field","name":{"kind":"Name","value":"likes"}},{"kind":"Field","name":{"kind":"Name","value":"replies"}},{"kind":"Field","name":{"kind":"Name","value":"parent"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"username"}}]}},{"kind":"Field","name":{"kind":"Name","value":"hasMedia"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"media"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}}]}}]} as unknown as DocumentNode<FindPostMediaByUserIdQuery, FindPostMediaByUserIdQueryVariables>;
export const GetPostByUserIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getPostByUserId"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"getShare"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getPostByUserId"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}},{"kind":"Argument","name":{"kind":"Name","value":"getShare"},"value":{"kind":"Variable","name":{"kind":"Name","value":"getShare"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"actions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"author"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"username"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"hasMedia"}},{"kind":"Field","name":{"kind":"Name","value":"parentId"}},{"kind":"Field","name":{"kind":"Name","value":"isShared"}},{"kind":"Field","name":{"kind":"Name","value":"liked"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}}]}},{"kind":"Field","name":{"kind":"Name","value":"media"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"shared"}},{"kind":"Field","name":{"kind":"Name","value":"shares"}},{"kind":"Field","name":{"kind":"Name","value":"likes"}},{"kind":"Field","name":{"kind":"Name","value":"replies"}},{"kind":"Field","name":{"kind":"Name","value":"parent"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"username"}}]}},{"kind":"Field","name":{"kind":"Name","value":"hasMedia"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"media"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetPostByUserIdQuery, GetPostByUserIdQueryVariables>;
export const GetPostLikesByUserIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getPostLikesByUserId"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getPostLikesByUserId"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"actions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"author"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"username"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"hasMedia"}},{"kind":"Field","name":{"kind":"Name","value":"isShared"}},{"kind":"Field","name":{"kind":"Name","value":"parentId"}},{"kind":"Field","name":{"kind":"Name","value":"liked"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}}]}},{"kind":"Field","name":{"kind":"Name","value":"media"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"shared"}},{"kind":"Field","name":{"kind":"Name","value":"shares"}},{"kind":"Field","name":{"kind":"Name","value":"likes"}},{"kind":"Field","name":{"kind":"Name","value":"replies"}},{"kind":"Field","name":{"kind":"Name","value":"parent"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"username"}}]}},{"kind":"Field","name":{"kind":"Name","value":"hasMedia"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"media"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetPostLikesByUserIdQuery, GetPostLikesByUserIdQueryVariables>;
export const RepliesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"replies"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"postId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"replies"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"postId"}}},{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"likes"}},{"kind":"Field","name":{"kind":"Name","value":"liked"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"medias"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"replyId"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"postId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"parentId"}},{"kind":"Field","name":{"kind":"Name","value":"postId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"replies"}}]}}]}}]} as unknown as DocumentNode<RepliesQuery, RepliesQueryVariables>;
export const GetChildrenRepliesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getChildrenReplies"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"postId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"replyId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getChildrenReplies"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"postId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"postId"}}},{"kind":"Argument","name":{"kind":"Name","value":"parentId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"replyId"}}},{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"likes"}},{"kind":"Field","name":{"kind":"Name","value":"liked"}},{"kind":"Field","name":{"kind":"Name","value":"mentions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"parentId"}},{"kind":"Field","name":{"kind":"Name","value":"postId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"replies"}}]}}]}}]} as unknown as DocumentNode<GetChildrenRepliesQuery, GetChildrenRepliesQueryVariables>;
export const GetShareByPostIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getShareByPostId"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"postId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getShareByPostId"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"postId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"postId"}}},{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"share"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}}]} as unknown as DocumentNode<GetShareByPostIdQuery, GetShareByPostIdQueryVariables>;
export const SearchDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"search"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"query"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"search"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"query"},"value":{"kind":"Variable","name":{"kind":"Name","value":"query"}}},{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"users"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"friendship"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"friendId"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"posts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"actions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"author"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"username"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"hasMedia"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"isShared"}},{"kind":"Field","name":{"kind":"Name","value":"liked"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}}]}},{"kind":"Field","name":{"kind":"Name","value":"media"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"shared"}},{"kind":"Field","name":{"kind":"Name","value":"shares"}},{"kind":"Field","name":{"kind":"Name","value":"likes"}},{"kind":"Field","name":{"kind":"Name","value":"replies"}},{"kind":"Field","name":{"kind":"Name","value":"parent"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"username"}}]}},{"kind":"Field","name":{"kind":"Name","value":"hasMedia"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"media"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<SearchQuery, SearchQueryVariables>;
export const SearchUsersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"searchUsers"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"query"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"searchUsers"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"query"},"value":{"kind":"Variable","name":{"kind":"Name","value":"query"}}},{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"friendship"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"friendId"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]}}]} as unknown as DocumentNode<SearchUsersQuery, SearchUsersQueryVariables>;
export const TimelineByCourseDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"timelineByCourse"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"timelineByCourse"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"actions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"author"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"username"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"hasMedia"}},{"kind":"Field","name":{"kind":"Name","value":"isShared"}},{"kind":"Field","name":{"kind":"Name","value":"liked"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}}]}},{"kind":"Field","name":{"kind":"Name","value":"media"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"shared"}},{"kind":"Field","name":{"kind":"Name","value":"shares"}},{"kind":"Field","name":{"kind":"Name","value":"likes"}},{"kind":"Field","name":{"kind":"Name","value":"replies"}},{"kind":"Field","name":{"kind":"Name","value":"parentId"}},{"kind":"Field","name":{"kind":"Name","value":"parent"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"username"}}]}},{"kind":"Field","name":{"kind":"Name","value":"hasMedia"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"media"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}}]}}]} as unknown as DocumentNode<TimelineByCourseQuery, TimelineByCourseQueryVariables>;
export const TimelineDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"timeline"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"timeline"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"actions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"author"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"username"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"hasMedia"}},{"kind":"Field","name":{"kind":"Name","value":"isShared"}},{"kind":"Field","name":{"kind":"Name","value":"liked"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}}]}},{"kind":"Field","name":{"kind":"Name","value":"media"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"shared"}},{"kind":"Field","name":{"kind":"Name","value":"shares"}},{"kind":"Field","name":{"kind":"Name","value":"likes"}},{"kind":"Field","name":{"kind":"Name","value":"parentId"}},{"kind":"Field","name":{"kind":"Name","value":"replies"}},{"kind":"Field","name":{"kind":"Name","value":"parent"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"username"}}]}},{"kind":"Field","name":{"kind":"Name","value":"hasMedia"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"media"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}}]}}]} as unknown as DocumentNode<TimelineQuery, TimelineQueryVariables>;
export const InvalidateTrackingDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"invalidateTracking"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"invalidateTracking"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"latitude"}},{"kind":"Field","name":{"kind":"Name","value":"longitude"}},{"kind":"Field","name":{"kind":"Name","value":"building"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"username"}}]}}]}}]} as unknown as DocumentNode<InvalidateTrackingMutation, InvalidateTrackingMutationVariables>;
export const SendTrackingDataDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"sendTrackingData"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"latitude"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"longitude"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"sendTrackingData"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"latitude"},"value":{"kind":"Variable","name":{"kind":"Name","value":"latitude"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"longitude"},"value":{"kind":"Variable","name":{"kind":"Name","value":"longitude"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"latitude"}},{"kind":"Field","name":{"kind":"Name","value":"longitude"}},{"kind":"Field","name":{"kind":"Name","value":"building"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"username"}}]}}]}}]} as unknown as DocumentNode<SendTrackingDataMutation, SendTrackingDataMutationVariables>;
export const GetTrackingDataDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getTrackingData"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getTrackingData"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"latitude"}},{"kind":"Field","name":{"kind":"Name","value":"longitude"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"username"}}]}}]}}]} as unknown as DocumentNode<GetTrackingDataQuery, GetTrackingDataQueryVariables>;
export const TrackingDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"tracking"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"tracking"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"latitude"}},{"kind":"Field","name":{"kind":"Name","value":"longitude"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"username"}}]}}]}}]} as unknown as DocumentNode<TrackingSubscription, TrackingSubscriptionVariables>;
export const GeneratePresignedUrlsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"generatePresignedUrls"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UrlRequestDTO"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"generatePresignedUrls"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"filename"}},{"kind":"Field","name":{"kind":"Name","value":"uploadUrl"}},{"kind":"Field","name":{"kind":"Name","value":"fileUrl"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}}]} as unknown as DocumentNode<GeneratePresignedUrlsMutation, GeneratePresignedUrlsMutationVariables>;
export const UpdateProfileDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateProfile"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateProfileDTO"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateProfile"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"bio"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"banner"}},{"kind":"Field","name":{"kind":"Name","value":"course"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<UpdateProfileMutation, UpdateProfileMutationVariables>;
export const GetUserProfileDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getUserProfile"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getUserProfile"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"bio"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"banner"}},{"kind":"Field","name":{"kind":"Name","value":"friendsCount"}},{"kind":"Field","name":{"kind":"Name","value":"course"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"friendship"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"friendId"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]}}]} as unknown as DocumentNode<GetUserProfileQuery, GetUserProfileQueryVariables>;
export const GetUsersByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getUsersById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"ids"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getUsersById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"ids"},"value":{"kind":"Variable","name":{"kind":"Name","value":"ids"}}},{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"friendship"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"friendId"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]}}]} as unknown as DocumentNode<GetUsersByIdQuery, GetUsersByIdQueryVariables>;
export const HeartbeatDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"heartbeat"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"heartbeat"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]} as unknown as DocumentNode<HeartbeatQuery, HeartbeatQueryVariables>;
export const MeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"banner"}},{"kind":"Field","name":{"kind":"Name","value":"bio"}},{"kind":"Field","name":{"kind":"Name","value":"course"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<MeQuery, MeQueryVariables>;
export const UserStatusDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"userStatus"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userStatus"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<UserStatusSubscription, UserStatusSubscriptionVariables>;