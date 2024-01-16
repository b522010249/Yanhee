import { Button, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useState } from 'react'
import { db } from '../database/config';
import { addDoc, collection, doc, getDocs, limit, orderBy, query, setDoc } from 'firebase/firestore';

const AddPackage: React.FC<any> =({ navigation })=>{
 
  return (
    <View style={styles.main}>
      
    </View>
  )
}

export default AddPackage

const styles = StyleSheet.create({
  main:{
    padding: 15,
  },
})
