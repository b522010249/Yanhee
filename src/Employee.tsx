import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { Row, Table } from "react-native-table-component";
import QRCode from "react-native-qrcode-svg";
import { db } from "../database/config";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
} from "firebase/firestore";
import { useReactToPrint } from "react-to-print";
import DropDown from "react-native-paper-dropdown";
let logoFromFile = require("../assets/Yanhee_logo.png");

const Employee = ({ route }) => {
  const { employeeID, companyID } = route.params;
  const componentRef = useRef(null);
  const [employeeData, setEmployeeData] = useState({});
  const [HealthCheckData, setHealthCheckData] = useState([]);
  const [historyData, setHistoryData] = useState([]);
  const [showDropDown, setShowDropDown] = useState(false);
  const [year, setyear] = useState (new Date().getFullYear().toString());
  const historyOptions = historyData.map((id) => ({
    label: id,
    value: id,
  }));
  useEffect(() => {
    const currentYear = new Date().getFullYear().toString();
    const fetchDocument = async () => {
      try {
        const employeeDocRef = doc(
          db,
          "Company",
          companyID,
          "Employee",
          employeeID
        );
        const employeeDocSnapshot = await getDoc(employeeDocRef);

        const historySubCollectionRef = collection(
          db,
          "Company",
          companyID,
          "Employee",
          employeeID,
          "History"
        );
        const historyDocsSnapshot = await getDocs(historySubCollectionRef);
        const ids = historyDocsSnapshot.docs.map((doc) => doc.id);
        console.log("historyData:", ids);
        setHistoryData(ids);

        if (employeeDocSnapshot.exists()) {
          const employeeData = employeeDocSnapshot.data();
          setEmployeeData(employeeData);
        } else {
          console.log("Employee document does not exist.");
        }

        const HealthCheckCollection = collection(
          db,
          "Company",
          companyID,
          "Employee",
          employeeID,
          "History",
          year,
          "HealthCheck"
        );
        const unsubscribe = onSnapshot(HealthCheckCollection, (snapshot) => {
          const healthCheckData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setHealthCheckData(healthCheckData);
        });

        return () => {
          unsubscribe();
        };
      } catch (error) {
        console.error("Error fetching employee document:", error);
      }
    };

    fetchDocument();
  }, [companyID, employeeID,year]);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const ComponentToPrint = React.forwardRef(({ companyID }, ref) => {
    return (
      <View ref={ref} style={styles.printPage}>
        {HealthCheckData.map((healthCheck, index) => {
          const { amount_sticker, name } = healthCheck;
          const stickerElements = Array.from(
            { length: amount_sticker },
            (_, i) => (
              <View key={i} style={styles.sticker}>
                <View style={styles.topContainer}>
                  <View style={styles.leftContainer}>
                    <Text style={styles.text}>
                      ลำดับที่: {employeeData["ลำดับ"]}
                    </Text>
                    <Text style={styles.text}>
                      {employeeData["คำนำหน้า"]} {employeeData["ชื่อจริง"]}
                      {"\n"}
                      {employeeData["นามสกุล"]}
                    </Text>
                  </View>
                  <View style={styles.rightContainer}>
                   
                    <QRCode
                      value={companyID + " /" + employeeData["HN."] + "/" + healthCheck.namecode}
                      logo={logoFromFile}
                      size={100}
                    />
                  </View>
                </View>
                <View style={styles.bottomContainer}>
                  {healthCheck.namecode === "PE" ? (
                    <Text style={{ ...styles.text, fontSize: 22 }}>
                      {employeeData["HN."]} {employeeData["ว/ด/ปีเกิด"]}
                    </Text>
                  ) : (
                    <Text style={{ ...styles.text, fontSize: 22 }}>{name}</Text>
                  )}
                </View>
              </View>
            )
          );

          return stickerElements;
        })}
      </View>
    );
  });

  const options = ["Option 1", "Option 2"];
  return (
    <ScrollView style={{ flex: 1 }}>
      <DropDown
          label={"Year"}
          visible={showDropDown}
          showDropDown={() => setShowDropDown(true)}
          onDismiss={() => setShowDropDown(false)}
          value={year}
          setValue={setyear}
          list={historyOptions}
        />
      <View style={{ flex: 1, padding: 16 }}>
        <View>
          <TouchableOpacity style={styles.incard2} onPress={handlePrint}>
            <Text>พิมพ์ทั้งหมด </Text>
          </TouchableOpacity>
          <div>
            <ComponentToPrint ref={componentRef} companyID={companyID} />
          </div>
          <TouchableOpacity style={styles.incard2}>
            <Text>พิมพ์สติกเกอร์</Text>
          </TouchableOpacity>
        </View>

        <View>
          <TextInput
            placeholder="Search"
            style={{
              height: 40,
              borderColor: "gray",
              borderWidth: 1,
              marginBottom: 10,
              padding: 8,
            }}
          />
          <Table borderStyle={{ borderWidth: 1, borderColor: "#C1C0B9" }}>
            <Row
              data={["โปรแกรมตรวจสุขภาพ", "สถานะ", "เวลา"]}
              style={{ height: 40, backgroundColor: "#f1f8ff" }}
              textStyle={{ fontSize: 12, fontWeight: "bold", marginLeft: 20 }}
            />
          </Table>
          <View>
            <TextInput placeholder="ความดันครั้งที่ 1" />
            <TextInput placeholder="ความดันครั้งที่ 2" />
            <TextInput placeholder="ชีพจรครั้งที่ 1" />
            <TextInput placeholder="ชีพจรครั้งที่ 2" />
          </View>
          <View>
            <TextInput placeholder="น้ำหนัก" />
            <TextInput placeholder="ส่วนสูง" />
            <Text>BMI</Text>
          </View>
          <View>
            <Text>โรคประจำตัว</Text>
            <Text>ประวัติการผ่าตัด</Text>
            <Text>ท่านดื่มสุราหรือไม่</Text>
            <Text>ท่านสูบบุหรี่หรือไม่</Text>
            <Text>มียา/สมุนไพร/อาหารเสรืมที่ใช้ประจำ</Text>
            <Text>มีประวัติแพ้ยา/อาหาร</Text>
            <Text>มีประวัติรักษาวัณโรคปอด หรือ โรคที่เกี่ยวกับปอด</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default Employee;

const styles = StyleSheet.create({
  sticker: {
    pageBreakBefore: "always",
    flexDirection: "column",
    marginLeft: 15,
  },
  leftContainer: {
    flex: 1.5,
    justifyContent: "center",
    flexWrap: "wrap",
  },
  rightContainer: {
    flex: 1,
    justifyContent: "center",
  },
  text: {
    fontSize: 22,
  },
  topContainer: {
    flex: 3,
    flexDirection: "row",
  },
  bottomContainer: {
    flex: 1,
  },
});
