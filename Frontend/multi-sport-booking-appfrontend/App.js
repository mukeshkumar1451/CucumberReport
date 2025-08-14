import React, { createContext, useContext, useState } from 'react';
import { Provider as PaperProvider, Snackbar } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import AuthProvider from './src/store/AuthProvider';
import RootNavigator from './src/navigation/RootNavigator';
import { createNavigationContainerRef } from '@react-navigation/native';
import { ErrorBoundary } from './src/components/ErrorBoundary';
import ThemeProvider from './src/store/ThemeProvider';
import './src/i18n';
import { I18nextProvider } from 'react-i18next';
import i18n from './src/i18n';

export const navigationRef = createNavigationContainerRef();
if (typeof global !== 'undefined') {
  global.navigationRef = navigationRef;
}

const ErrorContext = createContext({ showError: (msg) => {} });
export const useError = () => useContext(ErrorContext);

import * as Notifications from 'expo-notifications';

export default function App() {
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState('');
  const [retryFn, setRetryFn] = useState(null);

  React.useEffect(() => {
    const subscription = Notifications.addNotificationReceivedListener((notification) => {
      const msg = notification.request.content.title
        ? `${notification.request.content.title}: ${notification.request.content.body}`
        : notification.request.content.body;
      setSnackbarMsg(msg);
      setSnackbarVisible(true);
    });
    return () => subscription.remove();
  }, []);

  const showError = (msg, retry) => {
    setSnackbarMsg(msg);
    setSnackbarVisible(true);
    setRetryFn(() => retry);
  };

  return (
    <ThemeProvider>
      {(theme, navigationTheme) => (
        <PaperProvider theme={theme}>
          <ErrorContext.Provider value={{ showError }}>
            <AuthProvider>
              <ErrorBoundary>
                <NavigationContainer ref={navigationRef} theme={navigationTheme}>
                  <RootNavigator />
                  <Snackbar
                    visible={snackbarVisible}
                    onDismiss={() => setSnackbarVisible(false)}
                    duration={5000}
                    action={retryFn ? { label: 'Retry', onPress: retryFn, accessibilityLabel: 'Retry action' } : undefined}
                    accessibilityLiveRegion="polite"
                  >
                    {snackbarMsg}
                  </Snackbar>
                </NavigationContainer>
              </ErrorBoundary>
            </AuthProvider>
          </ErrorContext.Provider>
        </PaperProvider>
      )}
    </ThemeProvider>
  );
}
