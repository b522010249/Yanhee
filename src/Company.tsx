import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useEffect, useState } from "react";
import React from "react";
import { useNavigation } from "@react-navigation/native";

import {
  collection,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../database/config";
import { Portal,  Modal, } from "react-native-paper";
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
  const [isModalVisible, setModalVisible] = useState(false);
  const [convertedData, setConvertedData] = useState<Employee[] | null>(null);
  const [visible, setVisible] = React.useState(false);

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
        setEmployees(employeesData);
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
              <Text>สถานะ:</Text>
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