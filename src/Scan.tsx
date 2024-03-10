import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Camera } from 'expo-camera';

const Scan: React.FC<any> = ({ navigation }) => {
  
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [cameraRef, setCameraRef] = useState(null);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    console.log(data);
    const filteredCode = data.replace(/Alt0012/g, '').replace(/Shift/g, '');

    console.log(filteredCode);
    const [companyID, employeeID,year,healthCheckid] = filteredCode.split('/');
    navigation.navigate('SearchScan', { companyID, employeeID,year,healthCheckid });
    // Reset the scanned state after a delay (e.g., 2 seconds)
    setTimeout(() => {
      setScanned(false);
    }, 2000);
  };

  if (hasPermission === null) {
    return <Text>Requesting camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <View style={{ width: 500, height: 500 }}>
        <Camera
        barCodeScannerSettings={{barCodeTypes:["qr"]}}
          ref={(ref) => setCameraRef(ref)}
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  scanText: {
    fontSize: 20,
    color: 'black',
    textAlign: 'center',
    marginTop: 16,
  },
});

export default Scan;
