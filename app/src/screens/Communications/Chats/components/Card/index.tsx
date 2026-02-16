import { ChatMessageSub } from '../../../../../__generated__/graphql';
import { View } from 'react-native';
import * as S from './styles';
import { Text } from '../../../../../components/Text';
import { useChatCard } from './useChatCard';
import { Checks } from '../../../../../components/Icons/Checks';
import { Avatar } from '../../../../../components/Avatar';
import { Image } from '../../../../../components/Icons/Image';

interface Props {
  data: ChatMessageSub;
}

export function ChatCard({ data: rawData }: Props) {
  const { data, theme, handleNavigation } = useChatCard(rawData);
  return (
    <S.Container
      android_ripple={{
        color: 'rgba(0, 0, 0, 0.2)',
        foreground: true,
      }}
      onPress={() => {
        handleNavigation(rawData.chat.id);
      }}
    >
      <View>
        <Avatar
          source={data.icon}
          style={{ borderRadius: 999 }}
          size={40}
          useGroupPlaceholder={!data.isDirect}
        />
        {data.isOnline && <S.OnlineIcon />}
      </View>
      <View
        style={{
          flex: 1,
          marginLeft: 8,
        }}
      >
        <View>
          <S.Content>
            <Text
              weight={data.unread ? 'Semibold' : 'Regular'}
              size={18}
              numberOfLines={1}
              style={{ flex: 1, marginRight: 8 }}
            >
              {data.title}
            </Text>
            <Text
              color={data.unread ? theme.colors.blue : theme.colors.lightGray}
              size={14}
            >
              {data.date}
            </Text>
          </S.Content>
        </View>
        <S.ContentContainer>
          {data.isSelf && data.content && (
            <S.ReadIconContainer>
              <Checks
                size={20}
                color={data.isRead ? '#38bdf8' : theme.colors.lightGray}
              />
            </S.ReadIconContainer>
          )}
          <S.Content style={{ flex: 1, flexDirection: 'row' }}>
            {!data.content && data.hasMedia ? (
              <View
                style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}
              >
                <Image color={theme.colors.lightGray} />
                <Text
                  weight={data.unread ? 'Semibold' : 'Regular'}
                  color={theme.colors.lightGray}
                >
                  Mídia
                </Text>
              </View>
            ) : data.content ? (
              <View
                style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}
              >
                {data.shouldRenderMediaIcon && (
                  <Image color={theme.colors.lightGray} />
                )}
                <Text
                  weight={data.unread ? 'Semibold' : 'Regular'}
                  numberOfLines={1}
                >
                  {data.content?.trim()}
                </Text>
              </View>
            ) : (
              !data.content && !data.hasMedia && <Text></Text>
            )}
            {data.unread && (
              <S.UnreadContainer>
                <Text color="white" weight="Semibold" size={14}>
                  {rawData.chat.unreadMessages}
                </Text>
              </S.UnreadContainer>
            )}
          </S.Content>
        </S.ContentContainer>
      </View>
    </S.Container>
  );
}
