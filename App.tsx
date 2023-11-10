import { View, Text } from 'react-native'
import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from './src/Home';
import Package from './src/Package';
import Scan from './src/Scan';
import Register from './src/Register';

const Tab = createBottomTabNavigator();



const App = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Home" component={Home} />
        <Tab.Screen name="Package" component={Package} />
        <Tab.Screen name="Register" component={Register} />
        <Tab.Screen name="scan" component={Scan} />
      </Tab.Navigator>
    </NavigationContainer>
  )
}

export default App