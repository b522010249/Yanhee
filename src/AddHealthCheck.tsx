import { Button, Keyboard, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useState } from 'react'
import { db } from '../database/config';
import { doc, setDoc } from 'firebase/firestore';

const AddHeatlhCheck: React.FC<any> =({ navigation })=>{
  const [HealthCheck, SetHealthCheck] = useState<{
    name: string;
    price: number;
    amount_sticker: number;
    details: { id: number }[];
    status: boolean ;
  }>
  ({
    name: '',
    price: 0,
    amount_sticker:1,
    code: [],
    status: false
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
        style={styles.labeltext}
        value={HealthCheck.name}
        onChangeText={newText => SetHealthCheck({ ...HealthCheck,name:newText})}
        />
        <TextInput 
        placeholder='กรอกราคา' 
        keyboardType='numeric'
        style={styles.labeltext}
        value={HealthCheck.price.toString()}
        onChangeText={newText => SetHealthCheck({ ...HealthCheck,price: parseFloat(newText) || 0 })}
        />
                <TextInput 
        placeholder='กรอกจำนวนสติกเกอร์' 
        keyboardType='numeric'
        style={styles.labeltext}
        value={HealthCheck.amount_sticker.toString()}
        onChangeText={newText => SetHealthCheck({ ...HealthCheck,amount_sticker: parseFloat(newText) || 0 })}
        />
        <Button title="Add Input" onPress={handleAddInput} />
        {HealthCheck.code.map((input) => (
          <TextInput
            key={input.id}
            placeholder={`Enter text for Input ${input.id}`}
            style={styles.labeltext}
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
  labeltext:{
    marginBottom:10,
    height:40,
    borderWidth: 2,
    paddingLeft:5,
  },
})
