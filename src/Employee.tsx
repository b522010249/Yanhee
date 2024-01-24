import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const Employee = ({route}) => {
    const { employeeID } = route.params;
  return (
    <View>
      <Text>{employeeID}</Text>
      
    </View>
  )
}

export default Employee

const styles = StyleSheet.create({})