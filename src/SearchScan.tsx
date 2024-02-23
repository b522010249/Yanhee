import React from 'react';
import { View, StyleSheet } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import useScanDetection from 'use-scan-detection-react18';
import { useNavigation } from '@react-navigation/native';
const SearchScan: React.FC = () => {
    const navigation = useNavigation();
  useScanDetection({
    onComplete: (code) => {
        const filteredCode = code.replace(/Alt0012/g, '').replace(/Shift/g, '');
        
      console.log(filteredCode);
      // Handle the filtered barcode, e.g., update state or trigger actions
      const [companyID, employeeID] = filteredCode.split('/');
      navigation.navigate('Employee', { companyID, employeeID });
    },
  });

  return (
    <View style={styles.container}>
      <QRCode value="Energy Co./C602525/CXR" />
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
});

export default SearchScan;
