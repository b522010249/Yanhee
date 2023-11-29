import React, { useState } from 'react'
import { Button, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'

const AddCompany: React.FC<any> = () => {
    const [companyname_th,setcompanyname_th] = useState('');
    const [companyname_eng,setcompanyname_eng] = useState('');
    const [email,setemail] = useState('');
    const [tel,settel] = useState('');
    const [nextCompanyNumber, setNextCompanyNumber] = useState<number | null>(null);
    const onsubmit = async () => {
        console.log('Company Name (TH):', companyname_th);
        console.log('Company Name (ENG):', companyname_eng);
        console.log('Email:', email);
        console.log('Contact Number:', tel);
        const newDocumentName = `company_${nextCompanyNumber}`;
        console.log(newDocumentName)
    
        // try {
        //   const newDocumentName = `company_${nextCompanyNumber}`;
        //   const newCompanyRef = await addDoc(collection(db, 'company', newDocumentName), {
        //     name_th: companyname_th, // adjust the field names based on your actual data model
        //     name_eng: companyname_eng,
        //     email: email,
        //     tel: tel,
        //     timestamp: serverTimestamp(),
        //   });
    
        //   console.log('Document written with ID:', newCompanyRef.id);
        // } catch (error) {
        //   console.error('Error adding document:', error);
        // }
        
      }
  return (
    <View>
      <TextInput
      style={styles.input}
      placeholder="ใส่ชื่อบริษัท TH"
      onChangeText={(text) => setcompanyname_th(text)}
      value={companyname_th}
      />
      <TextInput
      style={styles.input}
      placeholder="ใส่ชื่อบริษัท ENG"
      onChangeText={(text) => setcompanyname_eng(text)}
      value={companyname_eng}
      />
            <TextInput
      style={styles.input}
      placeholder="อีเมล"
      onChangeText={(text) => setemail(text)}
      value={email}
      />
            <TextInput
      style={styles.input}
      placeholder="เบอร์ติดต่อ"
      onChangeText={(text) => settel(text)}
      value={tel}
      />
      <Button title="Submit" onPress={onsubmit}/>

    </View>
  )
}
const styles = StyleSheet.create({
    input: {
      height: 40,
      margin: 12,
      borderWidth: 1,
      padding: 10,
    },
  });
export default AddCompany