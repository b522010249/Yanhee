import React from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Text,
  Platform,
} from "react-native";
import { Switch } from "react-native-paper";
import useScanDetection from "use-scan-detection-react18";

const Home: React.FC<any> = ({ navigation }) => {
  const [isSwitchOn, setIsSwitchOn] = React.useState(false);
  const onToggleSwitch = () => {
    setIsSwitchOn(!isSwitchOn);
    console.log("Switch is toggled. New value:", !isSwitchOn);
  };
  if (Platform.OS === "web") {
    useScanDetection({
      onComplete: (code) => {
        const filteredCode = code.replace(/Alt0012/g, "").replace(/Shift/g, "");

        console.log(filteredCode);
        if (isSwitchOn) {
          console.log("it will naviage");
          const [companyID, employeeID] = filteredCode.split("/");
          navigation.navigate("Employee", { companyID, employeeID });
        } else {
          console.log("Hello");
        }

        // Handle the filtered barcode, e.g., update state or trigger actions
      },
    });
  }

  return (
    <View style={styles.main}>
      <Switch value={isSwitchOn} onValueChange={onToggleSwitch} />
      
      <ScrollView>
        <View style={styles.content}>
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate("AddHeatlhCheck")}
          >
            <Text>เพิ่มโปรแกรมตรวจสุขภาพ</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate("AddPackage")}
          >
            <Text>จัดการแพ๊คเกจตรวจสุขภาพ</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate("AddCompany")}
          >
            <Text>เพิ่มบริษัท</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate("CompanyListScreen")}
          >
            <Text>ดูรายการบริษัท</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate("Guest")}
          >
            <Text>บุคคลภายนอก</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate("BarcodeScan")}
          >
            <Text>แสกน</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate("HealthCheck")}
          >
            <Text>โปรแกรมตรวจสุขภาพ</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate("SearchScan")}
          >
            <Text>เพิ่มเติม</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate("test")}
          >
            <Text>test</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate("Sticker")}
          >
            <Text>Sticker</Text>
          </TouchableOpacity>
          
          
        </View>
      </ScrollView>
    </View>
  );
};
const styles = StyleSheet.create({
  main: {
    flex: 1,
  },
  content: {
    flexWrap: "wrap",
    flexDirection: "row",
    justifyContent: "center",
    gap: 35,
  },
  card: {
    backgroundColor: "gray",
    justifyContent: "center",
    alignItems: "center",
    margin: 10,
    width: 150,
    height: 150,
  },
});
export default Home;
