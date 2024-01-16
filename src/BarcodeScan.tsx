import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';

const BarcodeScan = () => {
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
  
    useEffect(() => {
      (async () => {
        const { status } = await BarCodeScanner.requestPermissionsAsync();
        setHasPermission(status  === 'granted');
      })();
    }, []);
  
    const handleBarCodeScanned = ({ type, data }) => {
        setScanned(true);
        console.log(`Bar code with type ${type} and data ${data} has been scanned!`);
    
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
    <View style={{ flex: 1,alignItems:'center',justifyContent:'center'}}>
        <View style={{ width:250,height:250}}>
        <BarCodeScanner
            onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
            style={StyleSheet.absoluteFillObject}
        />
        </View>
    </View>
  )
}

const styles = StyleSheet.create({
    scanText: {
      fontSize: 20,
      color: 'black',
      textAlign: 'center',
      marginTop: 16,
    },
  });

export default BarcodeScan