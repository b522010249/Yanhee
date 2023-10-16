// App.tsx
import React from 'react';
import { View, Platform } from 'react-native';
import WindowsComponent from './components/Windows/WindowsHome';
import MobileComponent from './components/Mobile/MobileHome';

const App: React.FC = () => {

  const isWindows = Platform.OS === 'windows';

  return (
    <View>
    {isWindows ? <WindowsComponent /> : <MobileComponent />}
  </View>
  );
};

export default App;
