import React, { useState } from "react";
import { View, Text, Button, ScrollView, StyleSheet, TextInput, TouchableOpacity, Modal, Platform } from "react-native";
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import * as XLSX from 'xlsx';
import DateTimePicker from '@react-native-community/datetimepicker';

const AddCompany: React.FC<any> =({ navigation })=>{
    const [convertedData, setConvertedData] = useState<string | null>(null);
    const [date, setDate] = useState(new Date());
    const [showPicker, setShowPicker] = useState(false);
  
    const onChange = (event, selectedDate) => {
      const currentDate = selectedDate || date;
      setShowPicker(Platform.OS === 'ios'); // Close the picker on iOS, or keep it open on Android
      setDate(currentDate);
    };
  
    const showDatepicker = () => {
      setShowPicker(true);
    };
    const pickDocument = async () => {
      try {
          let result = await DocumentPicker.getDocumentAsync({});
          const fileContent = await FileSystem.readAsStringAsync(result.assets[0].uri, { encoding: FileSystem.EncodingType.Base64 });
          const workbook = XLSX.read(fileContent, { type: 'base64' });
  
          // Assuming the first sheet is the one you want to convert
          const sheetName = workbook.SheetNames[0];
  
          // Convert sheet data to JSON
          const jsonData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
  
          // Set the converted data in state
          setConvertedData(jsonData);
          console.log(convertedData);
      } catch (error) {
        console.error('Error picking document:', error);
      }
    };
    const Sumbit =()=>{

    }
  
    return(
        <View style={styles.main}>
          <Text>เพิ่มบริษัท</Text>
          <TextInput style={styles.labeltext} placeholder="กรอกชื่อบริษัท" />
          <TextInput style={styles.labeltext} placeholder="กรอกเบอร์โทรติดต่อ" />
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

            {/* <Button title="Pick and Convert XLSX to JSONT" onPress={pickDocument} />
            <Text>Converted JSON Data:</Text>
            <ScrollView style={{ maxHeight: 600 }}>
            <Text>{JSON.stringify(convertedData, null, 1)}</Text>
            </ScrollView> */}
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