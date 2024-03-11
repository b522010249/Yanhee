import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { useEffect, useState } from "react";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../database/config";
import { Portal, Modal, Card, Text, TextInput, FAB } from "react-native-paper";
import AddEmployee from "./AddEmployee";
import DropDown from "react-native-paper-dropdown";
import AddPackage from "./AddPackage";
import AddSingleEmployee from "./AddSingleEmployee";

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

const countHealthChecks = async (
  companyId: string,
  historyId: string
): Promise<{
  healthCheckCounts: HealthCheckCount[];
  totalCounts: { [key: string]: number };
}> => {
  const employeesCollectionRef = collection(
    db,
    `Company/${companyId}/Employee`
  );

  const employeesSnapshot = await getDocs(employeesCollectionRef);

  const promises: Promise<HealthCheckCount>[] = [];

  employeesSnapshot.docs.forEach((employeeDoc) => {
    const employeeId = employeeDoc.id;
    const employeeName = employeeDoc.data().ชื่อจริง+' '+employeeDoc.data().นามสกุล; // Replace "ชื่อจริง" with the actual field name for employee name
    const order = employeeDoc.data().ลำดับ;
    const healthCheckCollectionRef = collection(
      db,
      `Company/${companyId}/Employee/${employeeId}/History/${historyId}/HealthCheck`
    );

    promises.push(
      (async () => {
        const querySnapshot = await getDocs(
          query(healthCheckCollectionRef, where("CheckupStatus", "==", true))
        );

        let PE = false;
        let EKG = false;
        let CXR = false;
        let UA = false;
        let bloodCheck = false;

        querySnapshot.docs.forEach((doc) => {
          const id = doc.data().id;
          switch (id) {
            case "PE":
              PE = true;
              break;
            case "EKG":
              EKG = true;
              break;
            case "CXR":
              CXR = true;
              break;
            case "UA":
              UA = true;
              break;
            default:
              // Assuming any other ID represents "blood check"
              if (!bloodCheck) {
                bloodCheck = true;
              }
              break;
          }
        });

        return {
          employeeId,
          employeeName,
          order,
          PE,
          EKG,
          CXR,
          UA,
          bloodCheck,
        };
      })()
    );
  });

  const countPerEmployee = await Promise.all(promises);
  // Calculate total counts
  const totals = countPerEmployee.reduce(
    (acc, counts) => {
      acc["จำนวนตรวจเจาะเลือด"] += counts.bloodCheck ? 1 : 0;
      acc["จำนวนตรวจโดยแพทย์"] += counts.PE ? 1 : 0;
      acc["จำนวนตรวจคลื่นไฟฟ้าหัวใจ"] += counts.EKG ? 1 : 0;
      acc["จำนวนตรวจเอกซเรย์ปอด"] += counts.CXR ? 1 : 0;
      acc["จำนวนตรวจปัสสาวะ"] += counts.UA ? 1 : 0;
      return acc;
    },
    {
      จำนวนตรวจเจาะเลือด: 0,
      จำนวนตรวจโดยแพทย์: 0,
      จำนวนตรวจคลื่นไฟฟ้าหัวใจ: 0,
      จำนวนตรวจเอกซเรย์ปอด: 0,
      จำนวนตรวจปัสสาวะ: 0,
    }
  );

  return { healthCheckCounts: countPerEmployee, totalCounts: totals };
};
interface HealthCheckCount {
  employeeId: string;
  employeeName: string;
  order: number;
  bloodCheck: boolean;
  PE: boolean;
  EKG: boolean;
  CXR: boolean;
  UA: boolean;
}
const Company: React.FC<any> = ({ route }) => {
  const { companyId } = route.params;
  const navigation = useNavigation();
  const [visible, setVisible] = React.useState(false);
  const [visible2, setVisible2] = React.useState(false);
  const [visible3, setVisible3] = React.useState(false);
  const [healthCheckCounts, setHealthCheckCounts] = useState<
    HealthCheckCount[]
  >([]);
  const [totalCounts, setTotalCounts] = useState<{ [key: string]: number }>({
    จำนวนตรวจเจาะเลือด: 0,
    จำนวนตรวจโดยแพทย์: 0,
    จำนวนตรวจคลื่นไฟฟ้าหัวใจ: 0,
    จำนวนตรวจเอกซเรย์ปอด: 0,
    จำนวนตรวจปัสสาวะ: 0,
  });

  const [year, setyear] = useState(new Date().getFullYear().toString());
  const [showDropDown, setShowDropDown] = useState(false);
  const years = [
    { label: "2022", value: "2022" },
    { label: "2023", value: "2023" },
    { label: "2024", value: "2024" },
    { label: "2025", value: "2025" },
  ];
  const numberOfEmployees = healthCheckCounts.length;
  const [state, setState] = React.useState({ open: false });

  const onStateChange = ({ open }) => setState({ open });

  const { open } = state;

  const showModal = () => setVisible(true);
  const showModal2 = () => setVisible2(true);
  const showModal3 = () => setVisible3(true);
  const hideModal = () => setVisible(false);
  const hideModal2 = () => setVisible2(false);
  const hideModal3 = () => setVisible3(false);

  const containerStyle = {
    backgroundColor: "rgba(255, 255, 255, 1)",
    padding: 20,
  };
  useEffect(() => {
    const fetchData = async () => {
      const { healthCheckCounts, totalCounts } = await countHealthChecks(
        companyId,
        "2024"
      );
      setHealthCheckCounts(healthCheckCounts);
      setTotalCounts(totalCounts);
    };

    fetchData();
  }, []);
  const handleCompanyPress = (employeeID: string, companyID: string) => {
    navigation.navigate("Employee", { employeeID, companyID });
  };
  // const notCompleteCount = Object.values(employeeStatus).filter(
  //   (status) => status === "Not Complete"
  // ).length;
  // const onGoingCount = Object.values(employeeStatus).filter(
  //   (status) => status === "On Going"
  // ).length;
  // const CompleteCount = Object.values(employeeStatus).filter(
  //   (status) => status === "Complete"
  // ).length;
  // const WaitingCount = Object.values(employeeStatus).filter(
  //   (status) => status === "Waiting Results"
  // ).length;
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
        {Object.entries(totalCounts).map(([type, count]) => (
          <Card>
            <Card.Content>
              <Text variant="titleLarge" key={type}>{`${type}: ${count}`}/{numberOfEmployees}</Text>
            </Card.Content>
          </Card>
        ))}

        {/* <Card>
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
        </Card> */}
      </View>
      <TextInput label="Search" />
      
      <ScrollView style={{ height: "100%", width: "100%" }}>
        <View style={styles.container2}>
          {healthCheckCounts
            .sort((a, b) => a.order - b.order)
            .map(
              ({
                employeeId,
                employeeName,
                order,
                bloodCheck,
                PE,
                EKG,
                CXR,
                UA,
              }) => (
                
                <TouchableOpacity
                  key={employeeId}
                  onPress={() => handleCompanyPress(employeeId, companyId)}
                >
                  <Card style={{ width: 400 }}>
                    <Card.Content>
                      <Text variant="titleLarge">ลำดับ: {order}</Text>
                      <Text variant="titleLarge">ชื่อ: {employeeName}</Text>
                      <Text
                        variant="titleLarge"
                        style={{ color: bloodCheck ? "green" : "black" }}
                      >
                        ตรวจเจาะเลือด:{" "}
                        {bloodCheck ? "ตรวจแล้ว" : "ยังไม่ได้ตรวจ"}
                      </Text>
                      <Text
                        variant="titleLarge"
                        style={{ color: PE ? "green" : "black" }}
                      >
                        ตรวจโดยแพทย์: {PE ? "ตรวจแล้ว" : "ยังไม่ได้ตรวจ"}
                      </Text>
                      <Text
                        variant="titleLarge"
                        style={{ color: EKG ? "green" : "black" }}
                      >
                        ตรวจxray: {EKG ? "ตรวจแล้ว" : "ยังไม่ได้ตรวจ"}
                      </Text>
                      <Text
                        variant="titleLarge"
                        style={{ color: CXR ? "green" : "black" }}
                      >
                        ตรวจหัวใจ: {CXR ? "ตรวจแล้ว" : "ยังไม่ได้ตรวจ"}
                      </Text>
                      <Text
                        variant="titleLarge"
                        style={{ color: UA ? "green" : "black" }}
                      >
                        ตรวจปัสสาวะ: {UA ? "ตรวจแล้ว" : "ยังไม่ได้ตรวจ"}
                      </Text>
                    </Card.Content>
                  </Card>
                </TouchableOpacity>
              )
            )}
        </View>
      </ScrollView>
      <Modal
        visible={visible}
        onDismiss={hideModal}
        contentContainerStyle={containerStyle}
      >
        <AddEmployee companyId={companyId} />
      </Modal>
      <Modal
        visible={visible2}
        onDismiss={hideModal2}
        contentContainerStyle={containerStyle}
      >
        <AddPackage companyId={companyId} />
      </Modal>
      <Modal
        visible={visible3}
        onDismiss={hideModal3}
        contentContainerStyle={containerStyle}
      >
        <AddSingleEmployee companyId={companyId} />
      </Modal>
      <Portal>
        <FAB.Group
          open={open}
          visible
          icon={open ? "plus-minus" : "plus"}
          actions={[
            {
              icon: "account-plus",
              label: "เพิ่มคนเดียว",
              onPress: showModal3,
            },
            {
              icon: "account-multiple-plus",
              label: "เพิ่มจาก Excel",
              onPress: showModal,
            },
            { icon: "package", onPress: showModal2 },
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
    justifyContent: "space-around",
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
