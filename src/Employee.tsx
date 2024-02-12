import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react';
import { Row, Table } from 'react-native-table-component';
import QRCode from 'react-native-qrcode-svg';
import { db } from '../database/config';
import { collection, doc, getDoc, onSnapshot } from 'firebase/firestore';
import { useReactToPrint } from 'react-to-print';

const Employee = ({ route }) => {
  const { employeeID, companyID } = route.params;
  const componentRef = useRef(null);
  const [employeeData, setEmployeeData] = useState({});
  const [healthCheckData, setHealthCheckData] = useState([]);
  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const employeeDocRef = doc(db, 'Company', companyID, 'Employee', employeeID);
        const employeeDocSnapshot = await getDoc(employeeDocRef);

        if (employeeDocSnapshot.exists()) {
          const employeeData = employeeDocSnapshot.data();
          setEmployeeData(employeeData);
        } else {
          console.log('Employee document does not exist.');
        }

        const HealthCheckCollection = collection(db, 'Company', companyID, 'Employee', employeeID, 'HealthCheck');
        const unsubscribe = onSnapshot(HealthCheckCollection, (snapshot) => {
          const healthCheckData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
          setHealthCheckData(healthCheckData);
        });

        setLoading(false);

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

  const ComponentToPrint = React.forwardRef(({ companyID }, ref) => {
    return (
      <View ref={ref} style={styles.printPage}>
        {healthCheckData.map((healthCheck, index) => {
          const { amount_sticker, name } = healthCheck;
          const stickerElements = Array.from(
            { length: amount_sticker },
            (_, i) => (
              <View key={i} style={styles.sticker}>
                <View style={styles.leftContainer}>
                  <View style={styles.rowContainer}>
                    <Text style={styles.label}>บริษัท: </Text>
                    <Text style={styles.text}>{companyID}</Text>
                  </View>
                  <View style={styles.rowContainer}>
                    <Text style={styles.label}>ชื่อ: </Text>
                    <Text style={styles.text}>
                      {employeeData["คำนำหน้า"]} {employeeData["ชื่อจริง"]}{" "}
                      {employeeData["นามสกุล"]}
                    </Text>
                  </View>
                  <View style={styles.rowContainer}>
                    <Text style={styles.label}>ลำดับที่: </Text>
                    <Text style={styles.text}>{employeeData["ลำดับ"]}</Text>
                  </View>
                  <View style={styles.rowContainer}>
                    <Text style={styles.text}>{name}</Text>
                  </View>
                </View>
                <View style={styles.rightContainer}>
                  <QRCode value={companyID+'.'+employeeData["HN."]+'.'+ name} size={60} />
                </View>
              </View>
            )
          );

          return stickerElements;
        })}
      </View>
    );
  });
  return (
    <ScrollView style={{ flex: 1 }}>
      <View style={{ flex: 1, padding: 16}}>
        <View>
          <TouchableOpacity style={styles.incard2} onPress={handlePrint}>
            <Text>พิมพ์ทั้งหมด </Text>
          </TouchableOpacity>
          <div style={{ display: "none" }}><ComponentToPrint ref={componentRef} companyID={companyID} /></div>
          <TouchableOpacity style={styles.incard2}>
            <Text>พิมพ์สติกเกอร์</Text>
          </TouchableOpacity>                
        </View>
          
        <View>
          <TextInput
            placeholder="Search"
            style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10, padding: 8 }}

          />
          <Table borderStyle={{ borderWidth: 1, borderColor: '#C1C0B9' }}>
            <Row
              data={['โปรแกรมตรวจสุขภาพ', 'สถานะ','เวลา']}
              style={{height: 40,backgroundColor: '#f1f8ff'}}
              textStyle={{ fontSize: 12, fontWeight: 'bold',marginLeft:20}}
            />
          </Table>
        </View>
      </View>
    </ScrollView>
  )
}

export default Employee

const styles = StyleSheet.create({
  sticker: {
    flex: 1,
    pageBreakBefore: 'always',
    alignContent: 'center',
    flexWrap:'wrap',
    flexDirection:'row',
    marginLeft:15,
    marginRight:15,
    alignItems:'center',
    paddingTop:10,
    paddingBottom:10
  },
  leftContainer: {
    flex: 3.5,
    height:100,
  },
  rightContainer: {
    flex: 1,
    alignItems:'flex-end',
    alignContent:'flex-start',
    height:100,
    paddingLeft:5
  },
  text: {
    fontSize: 12,
  },
  printPage: {
    '@media print': {
      '@page': {
        size: '2in 1in',
      },
    },
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  label: {
    textAlign:'right',
    width:50,
  },
})