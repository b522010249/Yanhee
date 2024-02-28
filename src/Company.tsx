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
import { Portal, Modal, Card, Text, TextInput, FAB } from "react-native-paper";
import AddEmployee from "./AddEmployee";
import DropDown from "react-native-paper-dropdown";

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
  const [employeeStatus, setEmployeeStatus] = useState<Record<string, string>>(
    {}
  );
  const [year, setyear] = useState(new Date().getFullYear().toString());
  const [showDropDown, setShowDropDown] = useState(false);
  const years = [
    { label: "2022", value: "2022" },
    { label: "2023", value: "2023" },
    { label: "2024", value: "2024" },
    { label: "2025", value: "2025" },
  ];
  const [state, setState] = React.useState({ open: false });

  const onStateChange = ({ open }) => setState({ open });

  const { open } = state;

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const containerStyle = {
    backgroundColor: "rgba(255, 255, 255, 1)",
    padding: 20,
  };
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
          let checkupStatusCount = 0;
          let hasIncompleteResults = false;
          let isOnGoing = false;
          let isWaitingResults = false;
          healthChecksSnapshot.forEach((healthCheckDoc) => {
            const { Resultsstatus, CheckupStatus } = healthCheckDoc.data();
            if (!CheckupStatus || !Resultsstatus) {
              isComplete = false;

              if (CheckupStatus && !Resultsstatus) {
                hasIncompleteResults = true;
              }
            }

            if (CheckupStatus) {
              checkupStatusCount++;
            }
          });

          // Update the Historystatus field in the History document
          let historyStatus = "Not Complete";

          if (isComplete) {
            historyStatus = "Complete";
          } else if (
            checkupStatusCount === healthChecksSnapshot.size &&
            hasIncompleteResults
          ) {
            isWaitingResults = true;
            historyStatus = "Waiting Results";
          } else if (checkupStatusCount > 0) {
            isOnGoing = true;
            historyStatus = "On Going";
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
  const notCompleteCount = Object.values(employeeStatus).filter(
    (status) => status === "Not Complete"
  ).length;
  const onGoingCount = Object.values(employeeStatus).filter(
    (status) => status === "On Going"
  ).length;
  const CompleteCount = Object.values(employeeStatus).filter(
    (status) => status === "Complete"
  ).length;
  const WaitingCount = Object.values(employeeStatus).filter(
    (status) => status === "Waiting Results"
  ).length;

  employees.sort((a, b) => a.ลำดับ - b.ลำดับ);
  return (
    <View style={styles.container}>
      <DropDown
        label={"Year"}
        visible={showDropDown}
        showDropDown={() => setShowDropDown(true)}
        onDismiss={() => setShowDropDown(false)}
        value={year}
        setValue={setyear}
        list={years}
      />
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        <Card>
          <Card.Content>
            <Text variant="titleLarge">จำนวนคนทั้งหมด:{totalEmployees}</Text>
          </Card.Content>
        </Card>
        <Card>
          <Card.Content>
            <Text variant="titleLarge">
              คนที่ยังไม่ได้ตรวจ :{notCompleteCount}
            </Text>
          </Card.Content>
        </Card>
        <Card>
          <Card.Content>
            <Text variant="titleLarge">กำลังตรวจ:{onGoingCount}</Text>
          </Card.Content>
        </Card>

        <Card>
          <Card.Content>
            <Text variant="titleLarge">รอผลตรวจ :{WaitingCount}</Text>
          </Card.Content>
        </Card>
        <Card>
          <Card.Content>
            <Text variant="titleLarge">ตรวจเสร็จสิ้น :{CompleteCount}</Text>
          </Card.Content>
        </Card>
      </View>
      <TextInput label="Search" />
      <ScrollView style={{ height: "100%", width: "100%" }}>
        <View style={styles.container2}>
          {employees.map((employee) => (
            <TouchableOpacity
              key={employee.ชื่อจริง}
              onPress={() => handleCompanyPress(employee.id, companyId)}
            >
              <Card style={{ height: 200, width: 300 }}>
                <Card.Content>
                  <Text variant="titleLarge">ลำดับ: {employee.ลำดับ}</Text>
                  <Text variant="titleLarge">
                    ชื่อ: {employee.ชื่อจริง} {employee.นามสกุล}
                  </Text>
                  <Text variant="titleLarge">P: {employee["P."]}</Text>
                  <Text variant="titleLarge">
                    สถานะ:{employeeStatus[employee.id]}
                  </Text>
                </Card.Content>
              </Card>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      <Modal
        visible={visible}
        onDismiss={hideModal}
        contentContainerStyle={containerStyle}
      >
        <AddEmployee companyId={companyId} />
      </Modal>
      <Portal>
        <FAB.Group
          open={open}
          visible
          icon={open ? "plus-minus" : "plus"}
          actions={[
            { icon: "plus", onPress: showModal },
            {
              icon: "barcode-scan",
              label: "barcode-scan",
              onPress: () => console.log("Pressed star"),
            },
          ]}
          onStateChange={onStateChange}
          onPress={() => {
            if (open) {
              // do something if the speed dial is open
            }
          }}
        />
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  container2: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "center",
    alignContent: "space-around",
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
    zIndex: 1,
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
