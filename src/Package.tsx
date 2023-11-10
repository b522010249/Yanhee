import { View, Text, Button } from 'react-native'
import React from 'react'

const Package: React.FC<any> = ({ navigation }) => {
  return (
    <View>
      <Text>package</Text>
      <Button
        title="Go to Home Screen"
        onPress={() => navigation.navigate('Home')}
      />
    </View>
  )
}

export default Package