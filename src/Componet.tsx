import React, { useState } from "react";
import { View, Text, Button, ScrollView, StyleSheet } from "react-native";
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import * as XLSX from 'xlsx';

const Component: React.FC<any> =({ navigation })=>{
    const [convertedData, setConvertedData] = useState<string | null>(null);
    const pickDocument = async () => {
      try {
          let result = await DocumentPicker.getDocumentAsync({});
          const fileContent = await FileSystem.readAsStringAsync(result.assets[0].uri, { encoding: FileSystem.EncodingType.Base64 });
          const workbook = XLSX.read(fileContent, { type: 'base64' });
  
          // Assuming the first sheet is the one you want to convert
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];
  
          // Convert sheet data to JSON
          const jsonData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
  
          // Set the converted data in state
          setConvertedData(jsonData);
          console.log(convertedData);
      } catch (error) {
        console.error('Error picking document:', error);
      }
    };
  
    return(
        <View style={styles.main}>
            <Button title="Pick and Convert XLSX to JSONT" onPress={pickDocument} />
            <Text>Converted JSON Data:</Text>
            <ScrollView style={{ maxHeight: 600 }}>
            <Text>{JSON.stringify(convertedData, null, 1)}</Text>
            </ScrollView>
        </View>
    );
};
const styles = StyleSheet.create({
    main:{
      backgroundColor: 'red',
    }
  });
export default Component