import React, { useState } from "react";
import { View, Text, Button, ScrollView, StyleSheet, TextInput, TouchableOpacity, Modal, Platform } from "react-native";
import { db } from '../database/config';
import { doc, setDoc } from 'firebase/firestore';

const AddCompany: React.FC<any> =({ navigation })=>{
    const [date, setDate] = useState(new Date());
    const [showPicker, setShowPicker] = useState(false);
    const [Company, SetCompany] = useState<{
      name: string;
      Engname:string;
      phone: number;
    }>
    ({
      name: '',
      Engname:'',
      phone:0,
    });
  
    const onChange = (event: any, selectedDate: Date) => {
      const currentDate = selectedDate || date;
      setShowPicker(Platform.OS === 'ios'); // Close the picker on iOS, or keep it open on Android
      setDate(currentDate);
    };
  
    const showDatepicker = () => {
      setShowPicker(true);
    };
    const Sumbit =async ()=>{
      try {
        const healthCheckDocRef = doc(db, 'Company', Company.Engname);
        await setDoc(healthCheckDocRef, Company);
  
        console.log('Company added');
        
      } catch (error) {
        console.error('Error adding/updating data:', error.message);
      }

    }
  
    return(
        <View style={styles.main}>
          <Text>เพิ่มบริษัท</Text>
          <TextInput style={styles.labeltext} placeholder="กรอกชื่อบริษัท" 
          value={Company.name}
          onChangeText={newText => SetCompany({ ...Company,name:newText})}
           />
          <TextInput style={styles.labeltext} placeholder="กรอกชื่อบริษัทENg" 
          value={Company.Engname}
          onChangeText={newText => SetCompany({ ...Company,Engname:newText})}
           />           
          <TextInput style={styles.labeltext} placeholder="กรอกเบอร์โทรติดต่อ" 
          keyboardType='numeric' value={Company.phone.toString()}
          onChangeText={newText => SetCompany({ ...Company,phone: parseFloat(newText) || 0 })}
          />
          {Platform.OS === 'android' && (
            <View>
              <TouchableOpacity onPress={showDatepicker} style={styles.calandar}>
                <Text>{date.toDateString()}</Text>
              </TouchableOpacity>
              {showPicker && (
                <DateTimePicker
                  testID="dateTimePicker"
                  value={date}
                  mode="date"
                  is24Hour={true}
                  display="default"
                  onChange={onChange}
                />
              )}
              <Button title='submit' onPress={Sumbit}/>
            </View>
          )}
          {Platform.OS === 'ios' && (
            <DateTimePicker
                testID="dateTimePicker"
                value={date}
                mode="date"
                is24Hour={true}
                display="default"
                onChange={onChange}
            />            
          )}
          <Button title='Sumbit' onPress={Sumbit}/>
          <Button title="Go to Home" onPress={() => navigation.navigate('Home')}/>
        </View>
    );
};
const styles = StyleSheet.create({
    main:{
      padding: 15,
    },
    modalBackground: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      width: 300,
      height: 300,
      backgroundColor: 'white',
      padding: 16,
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
    },
    labeltext:{
      marginBottom:10,
      height:40,
      borderWidth: 2,
      paddingLeft:5,
    },
    calandar:{
      height:40,
      marginBottom:10,
      borderWidth: 2,
      justifyContent: 'center',
      alignItems:'center',
    }
  });
export default AddCompany