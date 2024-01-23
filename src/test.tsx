import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import useScanDetection from 'use-scan-detection-react18';

const Test: React.FC = () => {
  const [Barcode, SetBarcode] = useState<String>('');

  useScanDetection({
    onComplete: (code) => {
      const filteredCode = code.replace(/Shift/g, ''); // Filter out "Shift" occurrences
      SetBarcode(filteredCode);
      // Handle the filtered barcode, e.g., update state or trigger actions
    },
  });
  return (
    <View style={styles.container}>
      <QRCode value="HNzIK4UwagpCo7IAdkxD" />
      <Text>{Barcode}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'red',
  },
  lastBarcode: {
    marginTop: 20,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Test;
