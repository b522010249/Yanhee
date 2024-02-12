import React, { useEffect, useRef, useState } from 'react';
import { Button, StyleSheet, View, Text, TouchableOpacity, TextInput } from 'react-native';
import { useReactToPrint } from 'react-to-print';
import { collection, doc, getDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../database/config';
import QRCode from 'react-native-qrcode-svg';

const Employee = ({ route }) => {
  const { employeeID, companyID } = route.params;
  const [isPrintVisible, setIsPrintVisible] = useState(false);
  const componentRef = useRef(null);
  const [employeeData, setEmployeeData] = useState({});
  const [healthCheckData, setHealthCheckData] = useState([]);
  const [loading, setLoading] = useState(true);

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
  const handleAmountStickerChange = (index, newValue) => {
    const updatedHealthCheckData = [...healthCheckData];
    updatedHealthCheckData[index].amount_sticker = newValue;
    setHealthCheckData(updatedHealthCheckData);
  };

  const ComponentToPrint = React.forwardRef(({ companyID }, ref) => {
    return (
      <View ref={ref} style={styles.printPage}>
        {healthCheckData.map((healthCheck, index) => {
          const { amount_sticker, name } = healthCheck;
          const stickerElements = Array.from({ length: amount_sticker }, (_, i) => (
            <View key={i} style={styles.sticker}>
              <View style={styles.leftContainer}>
                <Text style={{...styles.text,fontSize:14}}>บริษัท: {companyID}</Text>
                <Text style={styles.text}>ชื่อ: {employeeData['คำนำหน้า']} {employeeData['ชื่อจริง']} {employeeData['นามสกุล']}</Text>
                <Text style={styles.text}>ลำดับที่: {employeeData['ลำดับ']}</Text>
                <Text style={styles.text}>{name}</Text>
              </View>
              <View style={styles.rightContainer}>
                <QRCode value={employeeData['HN.']} size={60} />
              </View>
            </View>
          ));

          return stickerElements;
        })}
      </View>
    );
  });

  

  return (
    <View>
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <>
          <Button title="Print" onPress={handlePrint} />
          {/* <Button title="Print Selected" onPress={handlePrintSelected} /> */}

          <div style={{ display: "none" }}><ComponentToPrint ref={componentRef} companyID={companyID} /></div>
          {healthCheckData.map((HealthCheck, index) => (
          <View style={{borderWidth:1,height:150}} key={index}>
            <TouchableOpacity>
              <Text>{HealthCheck.name}</Text>
            </TouchableOpacity>
            <TextInput
                  placeholder="Enter amount_sticker"
                  value={HealthCheck.amount_sticker.toString()}
                  onChangeText={(newValue) => handleAmountStickerChange(index, newValue)}
            />
            </View>
          ))}
        </>
      )}
    </View>
  );
};

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
    
  },
  leftContainer: {
    flex: 2.5,
    height:122.3,
    borderWidth:1,
  },
  rightContainer: {
    flex: 1,
    alignItems:'flex-end',
    alignContent:'flex-start',
    height:122.3,
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
});

export default Employee;
