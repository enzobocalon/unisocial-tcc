import { StackNavigationProp } from '@react-navigation/stack';
import { BaseUser, Media, Post } from '../__generated__/graphql';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

export type StackParams = {
  Signin: undefined;
  Signup: undefined;
  index: undefined;
  Publish: {
    isSharing?: boolean;
    post?: Post;
  };
  DeepSearch: {
    query: string;
  };
  PostScreen: { postId: string };
  EditProfile: undefined;
  UserProfile: { userId: string };
  Communications: undefined;
  Chat: {
    chatId: string;
  };
  ChatDetails: {
    chatId: string;
  };
  NewChat: undefined;
  NewAssignment: undefined;
  UserSelection: {
    isAssignment: boolean;
    isTask: boolean;
    assignmentId?: string;
    includeSelf?: boolean;
    reset?: boolean;
  };
  GroupInfo: {
    members: BaseUser[];
    isAssignment: boolean;
  };
  AddUsers: {
    chatId?: string;
    assignmentId?: string;
    taskId?: string;
  };
  Assignment: {
    assignmentId: string;
  };
  AssignmentDetails: {
    assignmentId: string;
  };
  Task: {
    taskId: string;
  };
  LinkableChats: {
    assignmentId: string;
  };
  NewTask: {
    assignmentId: string;
    selectedUsers?: string[];
    taskId?: string;
  };
  Files: {
    taskId: string;
    assignmentId: string;
  };
  MediaModal: {
    media: Media[];
    index: number;
    shouldCreatePath?: boolean;
  };
};

export type StackProps = StackNavigationProp<StackParams>;

export type BottomTabParams = {
  Home: undefined;
  Search: undefined;
  Tracking: undefined;
  Notifications: undefined;
  Profile: {
    userId: string;
  };
};

export type BottomTabProps = BottomTabNavigationProp<BottomTabParams>;
