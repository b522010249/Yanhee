import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

const Test: React.FC = () => {
  const [barcode, setBarcode] = useState<string>('');

  useEffect(() => {
    let interval: NodeJS.Timeout;

    const handleKeyDown = (evt: { code: string; key: string }) => {
      if (interval) {
        clearInterval(interval);
      }

      if (evt.code === 'Enter') {
        if (barcode) {
          handleBarcode(barcode);
        }
        setBarcode('');
        return;
      }

      if (evt.key !== 'Shift') {
        setBarcode((prevBarcode) => prevBarcode + evt.key);
      }

      interval = setInterval(() => setBarcode(''), 20);
    };

    const intervalCleanup = () => {
      clearInterval(interval);
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      intervalCleanup();
    };
  }, [barcode]);

  const handleBarcode = (scannedBarcode: string) => {
    // Handle the scanned barcode, e.g., update state or trigger actions
    console.log(scannedBarcode);
  };

  return (
    <View style={styles.container}>
      <QRCode value="HNzIK4UwagpCo7IAdkxD" />
      <Text style={styles.lastBarcode}>{barcode}</Text>
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
