import { Button, StyleSheet, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { useReactToPrint }  from 'react-to-print';
import { collection, doc, getDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../database/config';
import QRCode from 'react-native-qrcode-svg';
import { G, Rect, Svg,Text } from 'react-native-svg';

const Employee = ({route}) => {
  const { employeeID,companyID } = route.params;
  const componentRef = useRef(null);
  const handlePrint = useReactToPrint({
      content: () => componentRef.current,
    });
  const [EmployeeData, setEmployeeData] = useState([]);
  const [HealthCheckData, setHealthCheckData] = useState([]);
  useEffect(() => {
    const fetchDocument = async () => {
      try {
        // Fetch Employee document
        const employeeDocRef = doc(db, 'Company', companyID, 'Employee', employeeID);
        const employeeDocSnapshot = await getDoc(employeeDocRef);
  
        // Check if the document exists before setting the state
        if (employeeDocSnapshot.exists()) {
          const employeeData = employeeDocSnapshot.data();
          console.log('Employee Data:', employeeData);
          setEmployeeData(employeeData);
        } else {
          console.log('Employee document does not exist.');
        }
  
        // Subscribe to HealthCheckCollection changes
        const HealthCheckCollection = collection(db, 'Company', companyID, 'Employee', employeeID,'HealthCheck');
        const unsubscribe = onSnapshot(HealthCheckCollection, (snapshot) => {
          const companiesData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
          setHealthCheckData(companiesData);
          console.log('HealthCheckData:', companiesData);
        });
  
        return () => {
          unsubscribe();
        };
      } catch (error) {
        console.error('Error fetching employee document:', error);
      }
    };
  
    fetchDocument();
  }, [companyID, employeeID]);
  const ComponentToPrint = React.forwardRef((props, ref) => {
    return (

      <View ref={ref} style={{ overflow: 'auto' }}>
          {HealthCheckData.map((healthCheck, index) => (
            <View key={index}>
              {healthCheck['code'].map((code, codeIndex) => (
                <View key={codeIndex} style={styles.Sticker}>
                <React.Fragment>
                  <Svg width={200} height={100}>
                    <Text x="0" y="20" fontSize="20">
                      {code.name}
                    </Text>                    
                    <Text x="0" y="35" fontSize="12" fill="#000000">
                      ลำดับที่:{EmployeeData['ลำดับ']}
                    </Text> 
                    <Text x="0" y="79" fontSize="12" fill="#000000">
                      {EmployeeData['คำนำหน้า']} {EmployeeData['ชื่อจริง']} {EmployeeData['นามสกุล']}
                    </Text>
                    <Text x="0" y="95" fontSize="12">
                      {healthCheck.id}
                    </Text>
                    <G x="127" y="12">
                      <QRCode value={EmployeeData['HN.']} size={70}/>
                    </G>                                        
                  </Svg>

{/* 
                  <View style={styles.box}>
                    <Text>{code.name}</Text>
                    <Text>{EmployeeData['ลำดับ']}</Text>
                    <Text>{EmployeeData['คำนำหน้า']} {EmployeeData['ชื่อจริง']} {EmployeeData['นามสกุล']}</Text>
                    <Text>{healthCheck.id}</Text>
                    
                  </View>
                  <View>
                    <QRCode value={EmployeeData['HN.']} size={80}/>
                  </View> */}
                </React.Fragment>
                </View>
              ))}
            </View>
          ))}
      </View>
    );
  });
  return (
    <View>
      <Text>{employeeID}</Text>
      <Text>{companyID}</Text>
      <ComponentToPrint ref={componentRef} companyID={companyID}/>
      <Button title="print"onPress={handlePrint}/>
    </View>
  )
}

export default Employee

const styles = StyleSheet.create({
  Sticker:{
    flex:1,
    pageBreakBefore: 'always',
    flexDirection:'row',
    alignContent:'center',
  },
  box:{
    width:200,
    height:100,
    backgroundColor:'red'

  }
})