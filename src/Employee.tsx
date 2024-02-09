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
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  const ComponentToPrint = React.forwardRef((props, ref) => {
    return (
      
      <div ref={ref} style={styles.PrintPage}>
        {HealthCheckData.map((healthCheck, index) => {
          const { amount_sticker } = healthCheck;

          // Create an array of sticker elements based on the amount_sticker
          const stickerElements = Array.from({ length: amount_sticker }, (_, i) => (
            <View key={i} style={styles.Sticker}>
              <View style={{flex:1,marginLeft:15,alignContent:'center',width:'100%',height:'100%',justifyContent: 'space-between', flexDirection:'row',}}>
                <React.Fragment>
                  <View style={styles.leftContainer}>
                    <Text style={styles.text}>บริษัท:{companyID}</Text>
                    <Text style={styles.text}>ชื่อ:{EmployeeData['คำนำหน้า']} {EmployeeData['ชื่อจริง']} {EmployeeData['นามสกุล']}</Text>
                    <Text style={styles.text}>ลำดับที่:{EmployeeData['ลำดับ']}</Text>
                    <Text style={styles.text}>{healthCheck.name}</Text>
                  </View>
                  <View style={styles.rightContainer}>
                    {/* You can display the QR code here */}
                    <QRCode value={EmployeeData['HN.']} size={70} />
                  </View>
                  {/* <Svg width={200} height={100}>
                    <Text x="0" y="20" fontSize="13">
                      บริษัท:{companyID}
                    </Text>
                    <Text x="0" y="35" fontSize="12" fill="#000000">
                      ลำดับที่:{EmployeeData['ลำดับ']}
                    </Text>
                    <Text x="0" y="79" fontSize="12" fill="#000000">
                      {EmployeeData['คำนำหน้า']} {EmployeeData['ชื่อจริง']} {EmployeeData['นามสกุล']}
                    </Text>
                    <Text x="0" y="95" fontSize="12">
                      {healthCheck.name}
                    </Text>
                    <G x="127" y="12">
                      <QRCode value={EmployeeData['HN.']} size={70} />
                    </G>
                  </Svg> */}
                </React.Fragment>
              </View>
            </View>
          ));

          return stickerElements;
        })}
      </div>
      // <View ref={ref} style={{ overflow: 'auto' }}>
      // </View>
    );
  });
  return (
    <View>
        <Button title="print"onPress={handlePrint}/>
      <ComponentToPrint ref={componentRef} companyID={companyID}/>

    </View>
  )
}

export default Employee

const styles = StyleSheet.create({
  Sticker:{
    flex:1,
    pageBreakBefore: 'always',
    alignContent:'center',
    marginTop:5,
  },
  PrintSticker: {
  },
  leftContainer: {
    flex: 1.4,
    justifyContent:'center'
  },
  rightContainer: {
    flex: 1,


  },
  text: {
    fontSize:12
  },
  PrintPage: {
    '@media print': {
      '@page': {
        size: '2in 1in', // Set the page size to 2.00 inches by 1.00 inch
        margin: 5, // Set margin in millimeters (mm)
      },
    },
  },
})