import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Profile } from '../../screens/Profile';
import { Home as HomeIcon } from '../Icons/Home';
import { Search as SearchIcon } from '../Icons/Search';
import { Home } from '../../screens/Home';
import { formatColor } from '../../utils/formatColor';
import { useTheme } from 'styled-components';
import { Search } from '../../screens/Search';
import { Tracking } from '../../screens/Tracking';
import { Notifications } from '../../screens/Notifications';
import { Pin } from '../Icons/Pin';
import { Bell } from '../Icons/Bell';
import { Avatar } from '../Avatar';
import { useAuth } from '../../context/AuthContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { BottomTabParams } from '../../types/Navigation';
import { useQuery } from '@tanstack/react-query';
import { makeGraphQLRequest } from '../../lib/graphQLClient';
import { GET_UNREAD_NOTIFICATIONS } from '../../services/notifications/queries/getUnreadNotifications';
import { UnreadNotificationsQuery } from '../../__generated__/graphql';
import { View } from 'react-native';
import { Text } from '../Text';

const Tab = createBottomTabNavigator<BottomTabParams>();

export function TabNavigator() {
  const theme = useTheme();
  const { user } = useAuth();
  const { data: unreadNotifcationsCount } = useQuery({
    queryKey: ['unreadNotificationsCount'],
    queryFn: async () => {
      const { unreadNotifications: data } =
        await makeGraphQLRequest<UnreadNotificationsQuery>({
          document: GET_UNREAD_NOTIFICATIONS,
        });
      return data;
    },
    enabled: !!user?.me.id,
  });
  if (!user?.me.id) {
    return null;
  }

  return (
    <SafeAreaProvider
      initialMetrics={{
        insets: {
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
        },
        frame: {
          height: 0,
          width: 0,
          x: 0,
          y: 0,
        },
      }}
    >
      <Tab.Navigator
        screenOptions={{
          tabBarStyle: {
            elevation: 5,
          },
          tabBarActiveTintColor: theme.colors.blue,
          tabBarShowLabel: false,
        }}
      >
        <Tab.Screen
          name="Home"
          component={Home}
          options={{
            headerShown: false,
            tabBarIcon: ({ color }) => (
              <HomeIcon color={formatColor(color)} size={20} />
            ),
          }}
        />

        <Tab.Screen
          name="Search"
          component={Search}
          options={{
            headerShown: false,
            tabBarIcon: ({ color }) => (
              <SearchIcon color={formatColor(color)} size={20} />
            ),
          }}
        />

        <Tab.Screen
          name="Tracking"
          component={Tracking}
          options={{
            headerShown: false,
            tabBarIcon: ({ color }) => (
              <Pin color={formatColor(color)} size={20} />
            ),
          }}
        />

        <Tab.Screen
          name="Notifications"
          component={Notifications}
          options={{
            headerShown: false,
            tabBarIcon: ({ color }) => (
              <View
                style={{
                  position: 'relative',
                }}
              >
                {unreadNotifcationsCount !== undefined &&
                  unreadNotifcationsCount > 0 && (
                    <View
                      style={{
                        position: 'absolute',
                        right: -6,
                        top: -6,
                        backgroundColor: '#FF4848',
                        width: 16,
                        height: 16,
                        zIndex: 1000,
                        borderRadius: 16,
                        alignContent: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Text
                        size={12}
                        align="center"
                        color="white"
                        weight="Semibold"
                      >
                        {unreadNotifcationsCount}
                      </Text>
                    </View>
                  )}
                <Bell color={formatColor(color)} size={20} />
              </View>
            ),
          }}
        />

        <Tab.Screen
          name="Profile"
          component={Profile}
          options={{
            headerShown: false,
            tabBarIcon: ({ color }) => (
              <Avatar color={formatColor(color)} source={user?.me?.avatar} />
            ),
          }}
          initialParams={{
            userId: user?.me.id,
          }}
        />
      </Tab.Navigator>
    </SafeAreaProvider>
  );
}
