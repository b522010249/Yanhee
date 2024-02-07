import React, { useEffect, useRef, useState } from 'react';
import { Button, StyleSheet, Text, TextInput, Touchable, TouchableOpacity, View } from 'react-native';
import { useReactToPrint } from 'react-to-print';
import { collection, doc, getDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../database/config';
import QRCode from 'react-native-qrcode-svg';
import { G, Svg, Text as SvgText } from 'react-native-svg';
import HealthCheck from './HealthCheck';

const Employee = ({ route }) => {
  const { employeeID, companyID } = route.params;
  const componentRef = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  const [employeeData, setEmployeeData] = useState([]);
  const [healthCheckData, setHealthCheckData] = useState([]);
  const [selectedHealthChecks, setSelectedHealthChecks] = useState<{ id: string }[]>([]);
  const [inputValues, setInputValues] = useState({});


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
  useEffect(() => {
    // Ensure selectedHealthChecks is updated when inputValues changes
    setSelectedHealthChecks(prevSelectedHealthChecks =>
      prevSelectedHealthChecks.map(item => ({
        id: item.id,
        amount: inputValues[item.id] || '',
      }))
    );
  }, [inputValues]);
  const Sticker = ({ children }) => (
    <View style={styles.sticker}>{children}</View>
  );

  const StickerData = [].concat(
    ...selectedHealthChecks.map(item => Array.from({ length: parseInt(item.amount, 10) }, () => item))
  );

  const ComponentToPrint = React.forwardRef(({ companyID }, ref) => (
    <View ref={ref} style={{ overflow: 'auto' }}>
      {StickerData.map((healthCheck, index) => (
        <Sticker key={index}>
            <React.Fragment key={index}>
              <Svg width={200} height={100}>
                <SvgText x="0" y="20" fontSize="20">
                  {healthCheck.name}
                </SvgText>
                <SvgText x="0" y="35" fontSize="12" fill="#000000">
                  ลำดับที่: {employeeData['ลำดับ']}
                </SvgText>
                <SvgText x="0" y="79" fontSize="12" fill="#000000">
                  {employeeData['คำนำหน้า']} {employeeData['ชื่อจริง']} {employeeData['นามสกุล']}
                </SvgText>
                <SvgText x="0" y="95" fontSize="12">
                  {healthCheck.id}
                </SvgText>
                <G x="127" y="12">
                  <QRCode value={employeeData['HN.']} size={70} />
                </G>
              </Svg>
            </React.Fragment>
        </Sticker>
      ))}
    </View>
  ));

  const handleHealthCheckPress = (index, healthCheckData) => {
    // Toggle the selected state for the clicked health check
    const existingIndex = selectedHealthChecks.findIndex(item => item.id === healthCheckData.id);
  
    if (existingIndex !== -1) {
      // If already selected, remove it from the array
      setSelectedHealthChecks(prevSelectedHealthChecks =>
        prevSelectedHealthChecks.filter(item => item.id !== healthCheckData.id)
      );
      setInputValues(prevInputValues => {
        const updatedInputValues = { ...prevInputValues };
        delete updatedInputValues[healthCheckData.id];
        return updatedInputValues;
      });
    } else {
      // If not selected, add it to the array
      setSelectedHealthChecks(prevSelectedHealthChecks => [
        ...prevSelectedHealthChecks,
        { id: String(healthCheckData.id), amount: inputValues[healthCheckData.id] || '' },
      ]);
      setInputValues(prevInputValues => ({
        ...prevInputValues,
        [healthCheckData.id]: prevInputValues[healthCheckData.id] || '',
      }));
    }
  };
  
  
  const handlelog = () => {
    console.log(selectedHealthChecks);
  }
  const handleInputChange = (id, value) => {
    setInputValues((prevInputValues) => {
      return { ...prevInputValues, [id]: value };
    });
  };
  return (
    <View>
      <Text>{employeeID}</Text>
      <Text>{companyID}</Text>
      <div style={{ display: "none" }}><ComponentToPrint ref={componentRef} companyID={companyID} /></div>
      {healthCheckData.map((HealthCheck, index) => (
        <View key={index}>
          <TouchableOpacity
            onPress={() => handleHealthCheckPress(index, HealthCheck)}
            style={[
              styles.sticker,
              selectedHealthChecks.some(item => item.id === HealthCheck.id) ? { borderColor: 'green', borderWidth: 2 } : null,
            ]}
          >
            <Text>{HealthCheck.name}</Text>
          </TouchableOpacity>
          {selectedHealthChecks.some(item => item.id === HealthCheck.id) && (
            <TextInput
              key={`input_${HealthCheck.id}`}
              value={inputValues[HealthCheck.id] || ''}
              onChangeText={value => handleInputChange(HealthCheck.id, value)}
              placeholder="Enter value"
            />
          )}
        </View>
      ))}
      <Button title="Print" onPress={handlePrint} />
    </View>
  );
};

export default Employee;

const styles = StyleSheet.create({
  sticker: {
    flex: 1,
    pageBreakBefore: 'always',
    flexDirection: 'row',
    alignContent: 'center',
  },
});
