import {
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import QRCode from "react-native-qrcode-svg";
import { db } from "../database/config";
import {
  collection,
  deleteDoc,
  deleteField,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  setDoc,
} from "firebase/firestore";
import { useReactToPrint } from "react-to-print";
import DropDown from "react-native-paper-dropdown";
import { useRoute } from "@react-navigation/native";
import { Button, DataTable, Text } from "react-native-paper";
import Biliing from "./Biliing";
const Employee = ({ navigation }) => {
  const route = useRoute();
  const { employeeID, companyID } = route.params;
  const componentRef = useRef(null);

  const namepe = "ตรวจปัสสาวะ";
  const [employeeData, setEmployeeData] = useState({});
  const [HealthCheckData, setHealthCheckData] = useState([]);
  const [HealthCheck, setHealthCheck] = useState([]);
  const [HistoryData, setHistoryData] = useState([]);
  const [showDropDown, setShowDropDown] = useState(false);
  const [year, setyear] = useState(new Date().getFullYear().toString());
  const historyOptions = HistoryData.map((data) => ({
    label: data.id,
    value: data.id,
  }));
  useEffect(() => {
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
        const historyData = historyDocsSnapshot.docs.map((doc) => ({
          id: doc.id,
          date: doc.data().date,
          status: doc.data().status,
        }));
        console.log("historyData:", historyData);
        setHistoryData(historyData);

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
          setHealthCheck(healthCheckData);
          // Separate entries based on the type
          const bloodCheckData = healthCheckData.filter(
            (entry) => entry.type === "blood check"
          );
          const otherCheckData = healthCheckData.filter(
            (entry) => entry.type !== "blood check"
          );

          // Store only the first entry for "blood check" type
          const firstBloodCheckEntry =
            bloodCheckData.length > 0 ? [bloodCheckData[0]] : [];

          // Concatenate the first "blood check" entry with other types
          const updatedHealthCheckData = [
            ...firstBloodCheckEntry,
            ...otherCheckData,
          ];

          // Set the state accordingly
          setHealthCheckData(updatedHealthCheckData);
          console.log(updatedHealthCheckData);
        });

        return () => {
          unsubscribe();
        };
      } catch (error) {
        console.error("Error fetching employee document:", error);
      }
    };

    fetchDocument();
  }, [companyID, employeeID, year]);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const ComponentToPrint = React.forwardRef(({ companyID }, ref) => {
    return (
      <View ref={ref}>
        {HealthCheckData.map((healthCheck, index) => {
          const { amount_sticker, name, type } = healthCheck;

          const stickerElements = Array.from(
            { length: amount_sticker },
            (_, i) => (
              <View key={i} style={styles.sticker}>
                <View style={styles.topContainer}>
                  <View style={styles.leftContainer}>
                    <Text style={styles.text}>
                      ลำดับที่: {employeeData["ลำดับ"]}
                    </Text>
                    <Text style={{ ...styles.text, fontSize: 16 }}>
                      {employeeData["คำนำหน้า"]} {employeeData["ชื่อจริง"]}
                      {"\n"}
                      {employeeData["นามสกุล"]}
                    </Text>
                  </View>
                  <View style={styles.rightContainer}>
                    <QRCode
                      value={
                        companyID +
                        "/" +
                        employeeData["HN."] +
                        "/" +
                        year +
                        "/" +
                        healthCheck.id
                      }
                      size={60}
                    />
                  </View>
                </View>
                <View style={styles.bottomContainer}>
                  {type === "blood check" ? (
                    <Text style={{ ...styles.text, fontSize: 16 }}>
                      ตรวจรายการเจาะเลือด
                    </Text>
                  ) : // Render content based on the existing condition
                  healthCheck.id === "PE" ? (
                    <Text style={{ ...styles.text, fontSize: 16 }}>
                      {employeeData["HN."]} {employeeData["ว/ด/ปีเกิด"]}
                    </Text>
                  ) : healthCheck.id === "UA" ? (
                    <Text style={{ ...styles.text, fontSize: 16 }}>
                      {employeeData["HN."]} {namepe}
                    </Text>
                  ) : (
                    <Text style={{ ...styles.text, fontSize: 16 }}>{name}</Text>
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

  const toggleCheckupStatus = async (item) => {
    try {
      const healthCheckDocRef = doc(
        db,
        "Company",
        companyID,
        "Employee",
        employeeID,
        "History",
        year,
        "HealthCheck",
        item.id
      );

      // Get the current data
      const currentData = (await getDoc(healthCheckDocRef)).data();

      // Update the CheckupStatus in Firebase
      await setDoc(healthCheckDocRef, {
        ...currentData,
        CheckupStatus: !item.CheckupStatus,
      });

      // Fetch updated data from Firebase
      const updatedSnapshot = await getDoc(healthCheckDocRef);

      // Update the local state with the updated data
      setHealthCheckData((prevData) =>
        prevData.map((entry) =>
          entry.id === item.id
            ? { ...entry, CheckupStatus: !item.CheckupStatus }
            : entry
        )
      );
    } catch (error) {
      console.error("Error toggling CheckupStatus:", error);
    }
  };
  const toggleCancel = async (item) => {
    try {
      const healthCheckDocRef = doc(
        db,
        "Company",
        companyID,
        "Employee",
        employeeID,
        "History",
        year,
        "HealthCheck",
        item.id
      );

      // Update the CheckupStatus in Firebase to null
      await setDoc(healthCheckDocRef, {
        ...item,
        CheckupStatus: null,
      });

      // Update the local state with the updated CheckupStatus
      setHealthCheckData((prevData) =>
        prevData.map((entry) =>
          entry.id === item.id ? { ...entry, CheckupStatus: null } : entry
        )
      );
    } catch (error) {
      console.error("Error toggling CheckupStatus:", error);
    }
  };

  const toggleCancelCheckup = async () => {
    try {
      const healthCheckCollectionRef = collection(
        db,
        "Company",
        companyID,
        "Employee",
        employeeID,
        "History",
        year,
        "HealthCheck"
      );

      // Get all documents in the HealthCheck collection
      const querySnapshot = await getDocs(healthCheckCollectionRef);

      // Delete each document in the HealthCheck collection
      querySnapshot.forEach(async (doc) => {
        await deleteDoc(doc.ref);
      });

      // Delete the HealthCheck collection itself
      await deleteField(healthCheckCollectionRef);
      // Update the status field in the History document to 'Cancel'
      const historyDocRef = doc(
        db,
        "Company",
        companyID,
        "Employee",
        employeeID,
        "History",
        year
      );
      await setDoc(historyDocRef, { status: "Cancel" }, { merge: true });
    } catch (error) {
      console.error("Error toggling CheckupStatus:", error);
    }
  };

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
          <div style={{ display: "none" }}>
            <ComponentToPrint ref={componentRef} companyID={companyID} />
          </div>
          <TouchableOpacity style={styles.incard2} onPress={handlePrint}>
            <Text>พิมพ์สติกเกอร์ </Text>
          </TouchableOpacity>
        </View>
        <Text>
          {HistoryData.length > 0
            ? HistoryData.find((item) => item.id === year)?.status || "Inactive"
            : ""}
        </Text>

        <View>
          <View>
            <Button onPress={toggleCancelCheckup}>ยกเลิกการตรวจ</Button>
            <Button>ตรวจ รพ.</Button>
          </View>

          <Button
            style={{ width: "100%" }}
            mode="contained"
            onPress={() => navigation.goBack()}
          >
            เสร็จสิ้น
          </Button>
          <DataTable>
            <DataTable.Header>
              <DataTable.Title>รายการตรวจสุขภาพ</DataTable.Title>
              <DataTable.Title numeric>สถานะการตรวจสุขภาพ</DataTable.Title>
              <DataTable.Title numeric>สถานะผลตรวจสุขภาพ</DataTable.Title>
              <DataTable.Title numeric>คำสั่ง</DataTable.Title>
            </DataTable.Header>
            {HealthCheck.map((item) => (
              <DataTable.Row key={item.id}>
                <DataTable.Cell>{item.name}</DataTable.Cell>
                <DataTable.Cell numeric>
                  <TouchableOpacity onPress={() => toggleCheckupStatus(item)}>
                    <Text>
                      {item.CheckupStatus === null
                        ? "ยกเลิก"
                        : item.CheckupStatus.toString()}
                    </Text>
                  </TouchableOpacity>
                </DataTable.Cell>
                <DataTable.Cell numeric>
                  {item.ResultsStatus.toString()}
                </DataTable.Cell>
                <DataTable.Cell numeric>
                  <Button mode="contained" onPress={() => toggleCancel(item)}>
                    ยกเลิก
                  </Button>
                </DataTable.Cell>
              </DataTable.Row>
            ))}
          </DataTable>
          <View>
            <Text>สั่งพิมใบเสร็จ</Text>
            <Biliing employeeData={employeeData} companyId={companyID} />
          </View>
          {/* <View>
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
          </View> */}
        </View>
      </View>
    </ScrollView>
  );
};

export default Employee;

const styles = StyleSheet.create({
  sticker: {
    flexDirection: "column",
    flex: 1,
    display: "flex",
    marginLeft: 15,

    pageBreakAfter: "always",
  },
  leftContainer: {
    flex: 1,
    display: "flex",
    position: "relative",
    justifyContent: "space-between",
  },
  rightContainer: {
    position: "absolute",
    top: 0,
    right: -20,
  },
  text: {
    fontSize: 18,
  },
  topContainer: {
    flex: 3,
    flexDirection: "row",
  },
  bottomContainer: {
    flex: 1,
  },
});
