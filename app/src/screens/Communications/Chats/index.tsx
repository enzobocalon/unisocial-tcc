import { Tabs } from 'react-native-collapsible-tab-view';
import { Text } from '../../../components/Text';
import { useChats } from './useChats';
import { ChatCard } from './components/Card';
import { FloatingButton } from '../../../components/FloatingButton';
import { NewChat } from '../../../components/Icons/NewChat';
import { Dimensions, RefreshControl, View } from 'react-native';
import { Loading } from '../../../components/Loading';
export function Chats() {
  const { chats, navigation, isLoading, theme, refreshing, onRefresh } =
    useChats();

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          marginTop: Dimensions.get('window').height / 2,
        }}
      >
        <Loading size={40} color={theme.colors.blue} />
      </View>
    );
  }

  return (
    <View
      style={{
        height: '100%',
      }}
    >
      <Tabs.FlatList
        data={chats}
        renderItem={({ item }) => <ChatCard data={item} />}
        ListHeaderComponent={() => (
          <>
            <Text style={{ marginLeft: 12, marginTop: 8 }} weight="Semibold">
              Mensagens
            </Text>
          </>
        )}
        ListEmptyComponent={() => (
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text weight="Semibold" numberOfLines={1}>
              Nenhum chat encontrado.
            </Text>
          </View>
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[theme.colors.blue]}
          />
        }
      />
      <View
        style={{
          position: 'absolute',
          bottom: 16,
          right: 0,
        }}
      >
        <FloatingButton
          onPress={() => navigation.navigate('NewChat')}
          icon={() => <NewChat color="white" size={28} />}
          size={64}
        />
      </View>
    </View>
  );
}
