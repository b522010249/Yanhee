import React, { useEffect, useRef, useState } from 'react';
import { Button, ScrollView, StyleSheet, Text, TextInput, Touchable, TouchableOpacity, View } from 'react-native';
import { useReactToPrint } from 'react-to-print';
import { collection, doc, getDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../database/config';
import QRCode from 'react-native-qrcode-svg';
import { G, Svg, Text as SvgText } from 'react-native-svg';

const Employee = ({ route }) => {
  const { employeeID, companyID } = route.params;
  const [healthCheckData, setHealthCheckData] = useState([]);
  const [employeeData, setEmployeeData] = useState([]);
  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const employeeDocRef = doc(db, 'Company', companyID, 'Employee', employeeID);
        const employeeDocSnapshot = await getDoc(employeeDocRef);

        if (employeeDocSnapshot.exists()) {
          const employeeData = employeeDocSnapshot.data();
          console.log('Employee Data:', employeeData);
          setEmployeeData(employeeData);
        } else {
          console.log('Employee document does not exist.');
        }

        const healthCheckCollection = collection(db, 'Company', companyID, 'Employee', employeeID, 'HealthCheck');
        const unsubscribe = onSnapshot(healthCheckCollection, (snapshot) => {
          const healthCheckData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
          setHealthCheckData(healthCheckData);
          console.log('HealthCheckData:', healthCheckData);
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
  return (
    <View style={styles.main}>
    <ScrollView >
        <View style={styles.content}>
          {healthCheckData.map((HealthCheck, index) => (
              <TouchableOpacity
                style={[styles.card,]}
              >
                <Text>{HealthCheck.name}</Text>
                <TextInput></TextInput>
              </TouchableOpacity>
          ))}
        </View>
    </ScrollView>
</View>
  )
}

export default Employee

const styles = StyleSheet.create({
  main:{
    flex: 1,
  },
  content:{

  },
  card: {
    width:'auto',
    height:75,
    marginBottom:10,
    backgroundColor: '#f2f2f2',
    borderBottomColor:'#e3e3e3',
    borderBottomWidth:2,
    padding:5,
    flexDirection:'row',
  },
})