import { Button, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useState } from 'react'

const AddHeatlhCheck: React.FC<any> =({ navigation })=>{
  const [HealthCheck, SetHealthCheck] = useState<{
    name: string;
    price: string;
    code: { id: number }[];
  }>
  ({
    name: '',
    price: '',
    code: [],
  });
  const Sumbit =()=>{
    console.log(HealthCheck)
  }
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
        value={HealthCheck.price}
        onChangeText={newText => SetHealthCheck({ ...HealthCheck,price:newText})}
        />
        <Button title="Add Input" onPress={handleAddInput} />
        {HealthCheck.code.map((input) => (
          <TextInput
            key={input.id}
            placeholder={`Enter text for Input ${input.id}`}
          />
        ))}
        
        <Button title='Sumbit' onPress={Sumbit}/>
    </View>
  )
}

export default AddHeatlhCheck

const styles = StyleSheet.create({
  main:{
    padding: 15,
  },
})
