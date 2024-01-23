import { Button, Keyboard, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useState } from 'react'
import { db } from '../database/config';
import { addDoc, collection, doc, getDocs, limit, orderBy, query, setDoc } from 'firebase/firestore';

const AddHeatlhCheck: React.FC<any> =({ navigation })=>{
  const [HealthCheck, SetHealthCheck] = useState<{
    name: string;
    price: number;
    code: { id: number }[];
  }>
  ({
    name: '',
    price: 0,
    code: [],
  });
  const Sumbit = async () => {
    try {
      const healthCheckDocRef = doc(db, 'HealthCheck', HealthCheck.name);
      await setDoc(healthCheckDocRef, HealthCheck);

      console.log('Data added/updated successfully!');
      Keyboard.dismiss();
      
    } catch (error) {
      console.error('Error adding/updating data:', error.message);
    }
  };
  const handleAddInput = () => {
    const newId = HealthCheck.code.length + 1;
    SetHealthCheck((prevHealthCheck)=>({...prevHealthCheck,code:[...prevHealthCheck.code,{id:newId}]}));
  };  
  return (
    <View style={styles.main}>
        <TextInput 
        placeholder='กรอกชื่อรายการตรวจสุขภาพ' 
        value={HealthCheck.name}
        onChangeText={newText => SetHealthCheck({ ...HealthCheck,name:newText})}
        />
        <TextInput 
        placeholder='กรอกราคา' 
        keyboardType='numeric'
        value={HealthCheck.price.toString()}
        onChangeText={newText => SetHealthCheck({ ...HealthCheck,price: parseFloat(newText) || 0 })}
        />
        <Button title="Add Input" onPress={handleAddInput} />
        {HealthCheck.code.map((input) => (
          <TextInput
            key={input.id}
            placeholder={`Enter text for Input ${input.id}`}
            
            onChangeText={newText=> SetHealthCheck((prevHealthCheck)=>({...prevHealthCheck,
              code: prevHealthCheck.code.map((item) =>
              item.id === input.id ? {...item, name: newText} :item)}))}
          />
        ))}
        <Button title='submit' onPress={Sumbit}/>
    </View>
  )
}

export default AddHeatlhCheck

const styles = StyleSheet.create({
  main:{
    padding: 15,
  },
})
