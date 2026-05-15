import React from 'react';
import {StatusBar, useColorScheme} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {ServiceAppProvider} from './src/context/ServiceAppContext';
import {AppNavigator} from './src/navigation/AppNavigator';

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <ServiceAppProvider>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <AppNavigator />
      </ServiceAppProvider>
    </SafeAreaProvider>
  );
}

export default App;
