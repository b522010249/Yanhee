import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import useScanDetection from 'use-scan-detection-react18';
import { useNavigation } from '@react-navigation/native';
import { useReactToPrint }  from 'react-to-print';
import ComponentToPrint from './Componetprint';


const Sticker: React.FC = ({route}) => {
  const { employeeID } = route.params;
  const navigation = useNavigation();
  const [barcode, setBarcode] = useState<string>(''); // Change here
  const componentRef = useRef(null);


  useScanDetection({
    onComplete: (code) => {
      const filteredCode = code.replace(/Shift/g, ''); // Filter out "Shift" occurrences
      setBarcode(filteredCode); // Change here
      // Handle the filtered barcode, e.g., update state or trigger actions
    },
  });
  
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  return (
    <View style={styles.container}>
      <QRCode value="HNzIK4UwagpCo7IAdkxD" />
      <ComponentToPrint ref={componentRef}/>
      <Button title="print"onPress={handlePrint}/>
      <Button title="Go to Details" onPress={() => navigation.navigate('Home')}/>
      <Text style={styles.lastBarcode}>{barcode}</Text> {/* Display the last scanned barcode */}
    </View>
  );
};
export default Sticker;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lastBarcode: {
    marginTop: 20,
    fontSize: 16,
    fontWeight: 'bold',
  },
});


