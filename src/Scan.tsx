import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet } from "react-native";
import { Camera } from "expo-camera";
import { BarCodeScanner } from 'expo-barcode-scanner';
import { SafeAreaView } from "react-native";

const Scan: React.FC<any> = ({ navigation }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [cameraRef, setCameraRef] = useState(null);

  const [cornerPoints, setCornerPoints] = useState([]);
  const [X, setX] = useState(0);
  const [Y, setY] = useState(0);
  const [H, setH] = useState(0);
  const [W, setW] = useState(0);
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync ();
      setHasPermission(status === "granted");
    })();
  }, []);

  const handleBarCodeScanned = ({ data, bounds, cornerPoints,}) => {
    setScanned(true);
    console.log(bounds);
    console.log(cornerPoints);
    const { origin, size } = bounds;
    setX(origin.x);
    setY(origin.y);
    setH(size.height);
    setW(size.width);
    console.log(data);
    // const filteredCode = data.replace(/Alt0012/g, "").replace(/Shift/g, "");

    // console.log(filteredCode);
    // const [companyID, employeeID, year, healthCheckid] =
    //   filteredCode.split("/");
    // navigation.navigate("SearchScan", {
    //   companyID,
    //   employeeID,
    //   year,
    //   healthCheckid,
    // });
    // Reset the scanned state after a delay (e.g., 2 seconds)
    setTimeout(() => {
      setScanned(false);
    }, );
  };

  if (hasPermission === null) {
    return <Text>Requesting camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <SafeAreaView style={{ flex: 1 ,backgroundColor:'blue'}}>
      <View  style={{ flex: 1 ,position:'relative',backgroundColor:'red'}}>
        <BarCodeScanner
          // barCodeScannerSettings={{ barCodeTypes: ["qr"] }}
          ref={(ref) => setCameraRef(ref)}
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        />
        <View
          style={{
            position: "absolute",
            top: Y,
            left: X,
            width: W,
            height: H,
            borderColor: "red",
            borderWidth: 2,
          }}
        ></View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  scanText: {
    fontSize: 20,
    color: "black",
    textAlign: "center",
    marginTop: 16,
  },
});

export default Scan;
