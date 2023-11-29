import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator,Transitio  } from '@react-navigation/native-stack';
import Home from './src/Home';
import Package from './src/Package';
import Scan from './src/Scan';
import Sticker from './src/Sticker';
import Register from './src/Register';
import AddCompany from './src/AddCompany';
import ViewEmployee from './src/ViewEmployee';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const HomeStack = () => (
  <Stack.Navigator screenOptions={{animation: 'slide_from_right',}}>
    <Stack.Screen name="Home" component={Home} />
    <Stack.Screen name="ViewEmployee" component={ViewEmployee} />
  </Stack.Navigator>
);
const App = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={{headerShown: false}}>
        <Tab.Screen name="Home" component={HomeStack} />
        <Tab.Screen name="AddCompany" component={AddCompany} />
        <Tab.Screen name="Sticker" component={Sticker} />
        <Tab.Screen name="Package" component={Package} />
        <Tab.Screen name="Register" component={Register} />
        <Tab.Screen name="scan" component={Scan} />
      </Tab.Navigator>
    </NavigationContainer>
  )
}

export default App