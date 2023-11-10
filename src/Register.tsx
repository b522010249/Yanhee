import React, { useEffect, useState } from 'react';
import { View, Text, Button,ScrollView, TextInput, StyleSheet } from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import XLSX from 'xlsx';
import RNFS from 'react-native-fs';
import { addDoc, collection, getDocs, limit, orderBy, query, serverTimestamp } from 'firebase/firestore';
import { db } from '../database/config';

const Register: React.FC<any> = () => {
  const [jsonData, setJsonData] = useState([]);
  const [fileResponse, setFileResponse] = useState([]);

  const [companyname_th,setcompanyname_th] = useState('');
  const [companyname_eng,setcompanyname_eng] = useState('');
  const [email,setemail] = useState('');
  const [tel,settel] = useState('');

  const [nextCompanyNumber, setNextCompanyNumber] = useState<number | null>(null);

  const pickxlsxFile = async () => {
    try {
      const response = await DocumentPicker.pick({
        type: [DocumentPicker.types.xlsx],
      });
      setFileResponse(response);
      const xlsxFilePath = response[0].uri;
      console.log(response[0])

      // Read the XLSX file and convert it to JSON using react-native-fs
      RNFS.readFile(xlsxFilePath, 'base64')
        .then((data) => {
          const workbook = XLSX.read(data, { type: 'base64' });
          const sheetName = workbook.SheetNames[0]; // Assuming you want to convert the first sheet
          const jsonData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

          setJsonData(jsonData); //set jsondata
        })
        .catch((error) => {
          console.error('Error reading the XLSX file:', error);
        });
    } catch (error) {
      if (DocumentPicker.isCancel(error)) {
      } else {
        console.error('Error picking the file:', error);
      }
    }
  };

  useEffect(() => {
    // Fetch existing documents to determine the next number
    const fetchCompanies = async () => {
      try {
        const companiesQuery = query(collection(db, 'company'), orderBy('name', 'desc'), limit(1));
        const snapshot = await getDocs(companiesQuery);

        if (snapshot.docs.length > 0) {
          const lastCompany = snapshot.docs[0].data();
          const lastNumber = parseInt(lastCompany.name.split('_')[1], 10);
          // Assuming the format is "company_i", increment the number for the next document
          setNextCompanyNumber(lastNumber + 1);
        } else {
          // If no documents exist, start with 1
          setNextCompanyNumber(1);
        }
      } catch (error) {
        console.error('Error fetching companies:', error);
      }
    };

    fetchCompanies();
  }, []);

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
      <Text>---------</Text>
      <Button title="Pick and Convert XLSX to JSON" onPress={pickxlsxFile} />
      <Text>Converted JSON Data:</Text>
      <ScrollView style={{ maxHeight: 600 }}>
        <Text>{JSON.stringify(jsonData, null, 2)}</Text>
      </ScrollView>
    </View>
  );
};
const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});
export default Register;