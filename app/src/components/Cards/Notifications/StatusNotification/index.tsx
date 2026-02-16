import { useTheme } from 'styled-components';
import { Avatar } from '../../../Avatar';
import { Text } from '../../../Text';
import * as S from './styles';
import { HeartFilled } from '../../../Icons/HeartFilled';
import {
  Notification,
  NotificationStatus,
} from '../../../../__generated__/graphql';
import { useMention } from '../../../../hooks/useMention';
import { Reply } from '../../../Icons/Reply';
import { Share } from '../../../Icons/Share';
import { At } from '../../../Icons/At';
import { useNavigation } from '@react-navigation/native';
import { StackProps } from '../../../../types/Navigation';
import { useAuthorsFormatter } from '../../../../hooks/useAuthorsFormatter';
import { Group } from '../../../Icons/Group';
import { Task } from '../../../Icons/Task';

interface StatusNotificationProps {
  notification: Notification;
}

const icons = {
  Task: <Task size={20} />,
  Assignment: <Group size={20} />,
  Like: <HeartFilled size={20} color={'#FF4848'} />,
  Reply: <Reply size={20} color="#008DCB" />,
  Mention: <At size={20} color={'#075093'} />,
  Share: <Share size={20} color="#00BA7C" />,
};

export function StatusNotification({ notification }: StatusNotificationProps) {
  const theme = useTheme();
  const { replaceMetaTag } = useMention();
  const navigation = useNavigation<StackProps>();
  const { getAuthors } = useAuthorsFormatter();

  return (
    <S.Container
      activeOpacity={0.8}
      isUnread={notification.status === NotificationStatus.Unread}
      onPress={() => {
        if (notification.postId) {
          navigation.navigate('PostScreen', { postId: notification.postId });
          return;
        }
        if (notification.taskId) {
          navigation.navigate('Task', { taskId: notification.taskId });
          return;
        }
        if (notification.assignmentId) {
          navigation.navigate('Assignment', {
            assignmentId: notification.assignmentId,
          });
          return;
        }
      }}
    >
      {icons[notification.type.name as keyof typeof icons]}

      <S.Wrapper>
        <Avatar size={28} source={notification.emitters[0].avatar} />
        <Text>
          <Text weight="Semibold">{getAuthors(notification.emitters)}</Text>{' '}
          {notification.message}
        </Text>
        <Text color={theme.colors.lightGray} numberOfLines={3}>
          {replaceMetaTag(
            notification.reply?.content
              ? notification.reply?.content
              : (notification.post?.content as string),
            true
          )}
        </Text>
      </S.Wrapper>
    </S.Container>
  );
}
