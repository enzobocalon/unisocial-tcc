import { createDrawerNavigator } from '@react-navigation/drawer';
import { TabNavigator } from './Tabs';
import { Drawer as DrawerComponent } from '../Drawer';

const Drawer = createDrawerNavigator();

export function DrawerNavigator() {
  return (
    <Drawer.Navigator drawerContent={(props) => <DrawerComponent {...props} />}>
      <Drawer.Screen
        name="drawer.index"
        component={TabNavigator}
        options={{
          headerShown: false,
          drawerItemStyle: {
            display: 'none',
          },
        }}
      />
    </Drawer.Navigator>
  );
}
