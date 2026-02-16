import * as S from './styles';
import { Text } from '../Text';
import { FlatList } from 'react-native';
import { BaseUser, BaseUserExtended } from '../../__generated__/graphql';
import { Avatar } from '../Avatar';
import { useCallback, useState } from 'react';
import { Dimensions } from 'react-native';

interface IUser extends BaseUser {
  user: BaseUser;
}
interface IUserAddable extends BaseUserExtended {
  user: {
    id: string;
    name: string;
    username: string;
    avatar: string;
  };
}
interface Props {
  text: string;
  data: IUser[];
  itemCb?: (item: BaseUser | IUserAddable) => void | Promise<void>;
}

export function HorizontalUserList({ text, itemCb, data }: Props) {
  const [scrollEnabled, setScrollEnabled] = useState(false);
  const screenWidth = Dimensions.get('screen').width;

  const handleScrollEnable = useCallback((contentWidth: number) => {
    setScrollEnabled(contentWidth > screenWidth);
  }, []);
  return (
    <S.Container>
      <Text weight="Semibold" style={{ marginBottom: 8 }} size={18}>
        {text}
      </Text>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        scrollEnabled={scrollEnabled}
        onContentSizeChange={handleScrollEnable}
        renderItem={({ item }) => (
          <S.Item
            onPress={itemCb ? () => itemCb(item) : undefined}
            disabled={!itemCb}
          >
            <Avatar
              source={item.user ? item.user.avatar : item.avatar}
              size={48}
            />
            <Text size={14} weight="Semibold" align="center">
              {item.user ? item.user.name : item.name}
            </Text>
          </S.Item>
        )}
        contentContainerStyle={{
          marginTop: 4,
        }}
        horizontal
      />
    </S.Container>
  );
}
