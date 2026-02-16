import 'react-native-reanimated';
import 'react-native-gesture-handler';
import { Navigators } from './components/navigation/Navigator';
import { NavigationContainer } from '@react-navigation/native';
import { ThemeProvider } from 'styled-components';
import theme from './assets/theme';
import { AuthProvider } from './context/AuthContext';
import Toast from 'react-native-toast-message';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { EventProvider } from 'react-native-outside-press';

import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from 'react-native-reanimated';

// This is the default configuration
configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false, // Reanimated runs in strict mode by default
});

const queryClient = new QueryClient();
export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <AuthProvider>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <EventProvider>
              <NavigationContainer>
                <BottomSheetModalProvider>
                  <Navigators />
                </BottomSheetModalProvider>
              </NavigationContainer>
            </EventProvider>
            <Toast />
          </GestureHandlerRootView>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
