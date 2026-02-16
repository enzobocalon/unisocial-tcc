import { createStackNavigator } from '@react-navigation/stack';
import { DrawerNavigator } from './Drawer';
import { Signin } from '../../screens/auth/Signin';
import { Signup } from '../../screens/auth/Signup';
import { Publish } from '../../screens/Publish';
import { PostScreen } from '../../screens/Post';
import { useAuth } from '../../context/AuthContext';
import { DeepSearch } from '../../screens/Search/DeepSearch';
import { StackParams } from '../../types/Navigation';
import { EditProfile } from '../../screens/EditProfile';
import { Profile } from '../../screens/Profile';
import { Communications } from '../../screens/Communications';
import { Chat } from '../../screens/Chat';
import { NewChat } from '../../screens/Communications/NewChat';
import { UserSelection } from '../../screens/Communications/Group/screens/UserSelection';
import { GroupInfo } from '../../screens/Communications/Group/screens/GroupInfo';
import { ChatDetails } from '../../screens/ChatDetails';
import { AddUsers } from '../../screens/AddUsers';
import { NewAssignment } from '../../screens/Communications/NewAssignment';
import { Assignment } from '../../screens/Assignment';
import { Task } from '../../screens/Task';
import { AssignmentDetails } from '../../screens/AssignmentDetails';
import { LinkableChats } from '../../screens/LinkableChats';
import { NewTask } from '../../screens/NewTask';
import { Files } from '../../screens/Files';
import { MediaModal } from '../Medias/MediaModal';

const Stack = createStackNavigator<StackParams>();

export function StackNavigator() {
  const { signedIn } = useAuth();
  return (
    <Stack.Navigator>
      {signedIn ? (
        <>
          <Stack.Screen
            name="index"
            component={DrawerNavigator}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Publish"
            component={Publish}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="DeepSearch"
            component={DeepSearch}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="PostScreen"
            component={PostScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="EditProfile"
            component={EditProfile}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="UserProfile"
            component={Profile}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Communications"
            component={Communications}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Chat"
            component={Chat}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="NewChat"
            component={NewChat}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="NewAssignment"
            component={NewAssignment}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="UserSelection"
            component={UserSelection}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="GroupInfo"
            component={GroupInfo}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Files"
            component={Files}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ChatDetails"
            component={ChatDetails}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="AddUsers"
            component={AddUsers}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Assignment"
            component={Assignment}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="AssignmentDetails"
            component={AssignmentDetails}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Task"
            component={Task}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="LinkableChats"
            component={LinkableChats}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="NewTask"
            component={NewTask}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="MediaModal"
            component={MediaModal}
            options={{
              presentation: 'transparentModal', // tipo modal transparente
              headerShown: false, // remove header
            }}
          />
        </>
      ) : (
        <>
          <Stack.Screen
            name="Signin"
            component={Signin}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Signup"
            component={Signup}
            options={{ headerShown: false }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}
