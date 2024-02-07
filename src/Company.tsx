import { ScrollView, StyleSheet, Text, TouchableOpacity, View, Button, Modal, Platform } from 'react-native';
import { useEffect, useState } from 'react';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import * as XLSX from 'xlsx';
import { collection, where,getDocs, setDoc, doc, query, addDoc, onSnapshot, getDoc } from 'firebase/firestore';
import { db } from '../database/config';

interface Employee {
  id:string;
  คำนำหน้า: string;
  ชื่อจริง: string;
  นามสกุล: string;
  'P.':string;
  'VN.':string;
  'HN.':string;
  ลำดับ:number;
  'ว/ด/ปีเกิด':Date;
}

const Company: React.FC<any> = ({ route }) => {
  const { companyId } = route.params;
  const [employees, setEmployees] = useState<Employee[]>([]);
  const navigation = useNavigation();
  const [isModalVisible, setModalVisible] = useState(false);
  const [convertedData, setConvertedData] = useState<Employee[] | null>(null);
  const [HealthCheckPackageData, setHealthCheckPackage] = useState<[]>([]);

  useEffect(() => {
    const fetchEmployees = async () => {
      const employeesCollection = collection(db, 'Company', companyId, 'Employee');
      const employeesSnapshot = await getDocs(employeesCollection);
      const employeesData = employeesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Employee));
      setEmployees(employeesData);
    };

    fetchEmployees();
  }, [companyId]);

  const handleCompanyPress = (employeeID: string,companyID: string) => {
    navigation.navigate('Employee', { employeeID , companyID });
  };

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const pickDocument = async () => {
    try {
      let result = await DocumentPicker.getDocumentAsync({});
      console.log(result);
  
      // Check if the platform is not web before using expo-file-system
      if (Platform.OS !== 'web') {
        const fileContent = await FileSystem.readAsStringAsync(result.assets[0].uri, { encoding: FileSystem.EncodingType.Base64 });
  
        const workbook = XLSX.read(fileContent, { type: 'base64' });
  
        // Assuming the first sheet is the one you want to convert
        const sheetName = workbook.SheetNames[0];
  
        // Convert sheet data to JSON
        const jsonData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {
          raw: false,
          dateNF: 'YYYY-MM-DDTHH:mm:ss.SSSZ', // Format for parsing dates
        }) as Employee[];
  
        // Convert date serial numbers to JavaScript Date objects
        jsonData.forEach((employee) => {
          if (employee.date) {
            employee.date = XLSX.utils.dateNum(employee.date);
          }
        });
  
        // Set the converted data in state
        setConvertedData(jsonData);
        console.log('Data picked');
      } else {
        // Web platform - Use fetch to download file content
        const fileUri = result.assets[0].uri;
  
        if (fileUri) {
          const response = await fetch(fileUri);
          const buffer = await response.arrayBuffer();
          const binaryString = new Uint8Array(buffer).reduce((data, byte) => data + String.fromCharCode(byte), '');
  
          const workbook = XLSX.read(binaryString, { type: 'binary' });
          const sheetName = workbook.SheetNames[1];
  
          // Convert sheet data to JSON
          const jsonData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {
            raw: false,
            dateNF: 'YYYY-MM-DDTHH:mm:ss.SSSZ', // Format for parsing dates
          }) as Employee[];
    
          // Convert date serial numbers to JavaScript Date objects
          jsonData.forEach((employee) => {
            if (employee.date) {
              employee.date = XLSX.utils.dateNum(employee.date);
            }
          });
    
          // Set the converted data in state
          setConvertedData(jsonData);
          console.log('Data picked');
  
          // Continue with the rest of your code to process the workbook
        } else {
          console.warn('Web platform detected, but file URI is missing.');
        }
      }
    } catch (error) {
      console.error('Error picking document:', error);
    }
  };
  
  

  const Submit = async () => {
    const hasEmptyKey = convertedData.some((item) =>
    Object.keys(item).some((key) => key.includes('__EMPTY'))
    );

    if (hasEmptyKey) {
      // Display an error message or handle the case where __EMPTY key is found
      console.error('Submission cannot be done because __EMPTY key is found.');
      return;
    }else{
      console.log(convertedData);
      for (const employee of convertedData) {
        const EmployeeCollectionRef = collection(db, 'Company', companyId, 'Employee');
        const customEmployeeName = employee['HN.'];
        const EmployeeDocRef = doc(EmployeeCollectionRef, customEmployeeName);
        await setDoc(EmployeeDocRef, employee);
        const HealthCheckCollectionRef = collection(EmployeeDocRef, 'HealthCheck');
  
        const healthCheckPackageRef = doc(db, 'HealthCheckPackage', employee['P.']);
        const healthCheckSubCollectionRef = collection(healthCheckPackageRef, 'HealthCheck');
        const healthCheckDocsSnapshot = await getDocs(healthCheckSubCollectionRef);
        healthCheckDocsSnapshot.forEach(async(healthCheckDoc)=>{
          const HealthCheckDocRef = doc(HealthCheckCollectionRef, healthCheckDoc.id);
          const healthCheckData = healthCheckDoc.data(); // Use healthCheckDoc.data() if you want to copy the entire document
  
      // Set data for the HealthCheck subcollection
      await setDoc(HealthCheckDocRef, healthCheckData);
        });
      // const healthCheckPackageRef = doc(db, 'HealthCheckPackage', '1');
      // const healthCheckSubCollectionRef = collection(healthCheckPackageRef, 'HealthCheck');
      // const healthCheckDocs = await getDocs(healthCheckSubCollectionRef);
      // const count = healthCheckDocs.size;
      // healthCheckDocs.forEach((doc) => {
      //   console.log('Document data:', JSON.stringify(doc.data(), null, 2));
      // });
      // console.log('Size',{count});
      };      

    }
  
}
  employees.sort((a, b) => a.ลำดับ - b.ลำดับ);
  return (
    <View style={styles.container}>
      <ScrollView style={{ height: '100%', width: '100%' }}>
        {employees.map((employee) => (
          <TouchableOpacity style={styles.card} key={employee.ชื่อจริง} onPress={() => handleCompanyPress(employee.id,companyId)}>
            <View style={styles.incard2}>
              <Text>ชื่อ: {employee.ชื่อจริง}</Text>
              <Text>id: {employee.id}</Text>
              <Text>ลำดับ: {employee.ลำดับ}</Text>
              <Text>P: {employee['P.']}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text>Employee Details:</Text>
            {convertedData && convertedData.length > 0 && (
              <View>
                {Object.entries(convertedData[0]).map(([key, value], index) => (
                  <Text key={index} style={key.includes('__EMPTY') ? { color: 'red' } : {}}>
                    {`${key} ${JSON.stringify(value)}`}
                  </Text>
                ))}
              </View>
            )}
            <Button title="Pick and Convert XLSX to JSON" onPress={pickDocument} />
            <Button title="Submit" onPress={Submit} />
            <Button title="Close Modal" onPress={toggleModal} />
          </View>
        </View>
      </Modal>
      <TouchableOpacity style={styles.AddEmployee} onPress={toggleModal}>
        <Text>เพิ่มพนักงาน</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    width: 'auto',
    height: 75,
    marginBottom: 10,
    backgroundColor: '#f2f2f2',
    borderBottomColor: '#e3e3e3',
    borderBottomWidth: 2,
    padding: 5,
    flexDirection: 'row',
  },
  incard1: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  incard2: {
    flex: 9,
    marginLeft: 10,
    justifyContent: 'center',
  },
  AddEmployee: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    margin: 10,
    backgroundColor: 'green',
    padding: 10,
    borderTopColor: '#e3e3e3',
    borderTopWidth: 2,
    zIndex: 1,
    width: 100,
    height: 100,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
});

export default Company;
