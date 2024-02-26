import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { useEffect, useState } from "react";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { db } from "../database/config";
import { Portal, Modal, Card, Text, TextInput } from "react-native-paper";
import AddEmployee from "./AddEmployee";

interface Employee {
  id: string;
  คำนำหน้า: string;
  ชื่อจริง: string;
  นามสกุล: string;
  "P.": string;
  "VN.": string;
  "HN.": string;
  ลำดับ: number;
  "ว/ด/ปีเกิด": Date;
  สถานะ: boolean;
}

const Company: React.FC<any> = ({ route }) => {
  const { companyId } = route.params;
  const [employees, setEmployees] = useState<Employee[]>([]);
  const navigation = useNavigation();
  const [visible, setVisible] = React.useState(false);
  const [totalEmployees, setTotalEmployees] = useState<number>(0);
  const [employeeStatus, setEmployeeStatus] = useState<Record<string, string>>({});

 

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const containerStyle = { backgroundColor: "white", padding: 20 };
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "Company", companyId, "Employee"),
      (snapshot) => {
        const employeesData = snapshot.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() } as Employee)
        );
        setTotalEmployees(employeesData.length);
        setEmployees(employeesData);
        employeesData.forEach(async (employee) => {
          const historyId = "2024"; // Replace with the actual field name

          const historyRef = doc(
            db,
            "Company",
            companyId,
            "Employee",
            employee["HN."],
            "History",
            "2024"
          );

          const healthChecksSnapshot = await getDocs(
            collection(historyRef, "HealthCheck")
          );

          let isComplete = true;
          let isOnGoing = false;
          let isWaitingResults = false;
          healthChecksSnapshot.forEach((healthCheckDoc) => {
            const { Resultsstatus, CheckupStatus } = healthCheckDoc.data();
            console.log(`Employee:${employee["HN."]}`);
            console.log(`HealthCheckDoc ID: ${healthCheckDoc.id}`);
            console.log(
              `CheckupStatus: ${CheckupStatus}, Resultsstatus: ${Resultsstatus}`
            );
            if (!CheckupStatus || !Resultsstatus) {
              isComplete = false;
    
              if (CheckupStatus) {
                isOnGoing = true;
              }
            }
    
            if (CheckupStatus && Resultsstatus) {
              isWaitingResults = true;
            }
          });

          // Update the Historystatus field in the History document
          let historyStatus = "Not Complete";

          if (isComplete) {
            historyStatus = "Complete";
          } else if (isOnGoing) {
            historyStatus = "On Going";
          } else if (isWaitingResults) {
            historyStatus = "Waiting Results";
          }

          await updateDoc(historyRef, { status: historyStatus });
          setEmployeeStatus((prevStatus) => ({
            ...prevStatus,
            [employee.id]: historyStatus,
          }));


          console.log(
            `Updated History ${historyId} status to ${historyStatus}`
          );
        });
      }
    );

    return () => unsubscribe(); // Cleanup on component unmount
  }, [companyId]);
  const handleCompanyPress = (employeeID: string, companyID: string) => {
    navigation.navigate("Employee", { employeeID, companyID });
  };
  employees.sort((a, b) => a.ลำดับ - b.ลำดับ);
  return (
    <View style={styles.container}>
      <View style={{ flexDirection: "row" }}>
        <Card>
          <Card.Content>
            <Text variant="titleLarge">จำนวนคนทั้งหมด:{totalEmployees}</Text>
          </Card.Content>
        </Card>
        <Card>
          <Card.Content>
            <Text variant="titleLarge">
              จำนวนคนที่เข้ารับการตรวจ:
            </Text>
          </Card.Content>
        </Card>
        <Card>
          <Card.Content>
            <Text variant="titleLarge">
              จำนวนคนที่ยังไม่ได้เข้ารับการตรวจ :
            </Text>
          </Card.Content>
        </Card>
      </View>
      <TextInput label="Search" />
      <ScrollView style={{ height: "100%", width: "100%" }}>
        <View style={styles.container}>
          {employees.map((employee) => (
            <TouchableOpacity
              style={styles.card}
              key={employee.ชื่อจริง}
              onPress={() => handleCompanyPress(employee.id, companyId)}
            >
              <View style={styles.incard1}>
                <Text>ลำดับ: {employee.ลำดับ}</Text>
                <Text>
                  ชื่อ: {employee.ชื่อจริง} {employee.นามสกุล}
                </Text>
                <Text>P: {employee["P."]}</Text>
              </View>
              <Text>สถานะ:{employeeStatus[employee.id]}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      <Portal>
        <Modal
          visible={visible}
          onDismiss={hideModal}
          contentContainerStyle={containerStyle}
        >
          <AddEmployee companyId={companyId} />
        </Modal>
      </Portal>
      <TouchableOpacity style={styles.AddEmployee} onPress={showModal}>
        <Text>เพิ่มพนักงาน</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    width: 400,
    height: 75,
    marginBottom: 10,
    backgroundColor: "#f2f2f2",
    borderColor: "#e3e3e3",
    borderWidth: 2,
    padding: 5,
    flexDirection: "row",
  },
  incard1: {
    flex: 6,
    marginLeft: 10,
    justifyContent: "center",
  },
  incard2: {
    flex: 3,
    justifyContent: "center",
  },
  AddEmployee: {
    position: "absolute",
    bottom: 0,
    right: 0,
    margin: 10,
    backgroundColor: "green",
    padding: 10,
    borderTopColor: "#e3e3e3",
    borderTopWidth: 2,
    zIndex: 1,
    width: 100,
    height: 100,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 22,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    borderColor: "rgba(0, 0, 0, 0.1)",
  },
});

export default Company;
