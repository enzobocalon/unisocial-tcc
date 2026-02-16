import { FlatList, View } from 'react-native';
import ScreenHeader from '../../components/ScreenHeader';
import * as S from './styles';
import { StackScreenProps } from '@react-navigation/stack';
import { StackParams } from '../../types/Navigation';
import { useLinkableChats } from './useLinkableChats';
import { Text } from '../../components/Text';
import { Avatar } from '../../components/Avatar';
import { Loading } from '../../components/Loading';

type Props = StackScreenProps<StackParams, 'LinkableChats'>;

export function LinkableChats({ route }: Props) {
  const {
    data,
    hasNextPage,
    handleSelection,
    fetchNextPage,
    isPending,
    theme,
    chat,
  } = useLinkableChats(route.params.assignmentId);

  return (
    <S.Container>
      <ScreenHeader
        text="Vincular Chat"
        renderBackButton
        renderRightComponent={() => <View></View>}
      />
      <View style={{ paddingHorizontal: 16, paddingVertical: 8 }}>
        <Text size={18} weight="Semibold">
          Chats vinculáveis por você
        </Text>
      </View>
      <FlatList
        data={data}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <S.ChatCard
            activeOpacity={0.7}
            onPress={() => handleSelection(item.id)}
            disabled={isPending}
          >
            <View
              style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}
            >
              <Avatar size={36} source={item.icon} />
              <Text size={20}>{item.name}</Text>
            </View>
            {isPending && chat === item.id && (
              <Loading color={theme.colors.blue} />
            )}
          </S.ChatCard>
        )}
        onEndReached={() => {
          if (hasNextPage) {
            fetchNextPage();
          }
        }}
      />
    </S.Container>
  );
}
