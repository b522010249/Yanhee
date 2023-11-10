import { Text, StyleSheet } from 'react-native'
import React, { useEffect } from 'react'
import { Camera, Code, useCameraDevice, useCameraPermission, useCodeScanner } from 'react-native-vision-camera'

const Scan: React.FC<any> = () => {
    const { hasPermission, requestPermission } = useCameraPermission()
    const device = useCameraDevice('back')
    const codeScanner = useCodeScanner({
      codeTypes: ['qr', 'ean-13'],
      onCodeScanned: (codes: Code[]) => {
        console.log(`${codes[0].value}`)
      }
    })
    useEffect(()=>{
      requestPermission();
    })
  
    if (device == null) {return <Text>no device</Text>}
  return (
    <Camera
    style={StyleSheet.absoluteFill}
    device={device}
    isActive={true}
    codeScanner={codeScanner}
    />
  )
}

export default Scan