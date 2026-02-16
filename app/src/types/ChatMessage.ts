import { Maybe } from 'graphql/jsutils/Maybe';
import { IMessage } from 'react-native-gifted-chat';

export interface ChatMessage extends IMessage {
  medias?: Maybe<string>[];
}
