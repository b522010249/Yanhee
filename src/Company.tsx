import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Button,
  Modal,
  Platform,
} from "react-native";
import { useEffect, useState } from "react";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import * as XLSX from "xlsx";
import {
  collection,
  where,
  getDocs,
  setDoc,
  doc,
  query,
  addDoc,
  onSnapshot,
  getDoc,
} from "firebase/firestore";
import { db } from "../database/config";

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
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });

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
  useEffect(() => {
    if (!loading && !isModalVisible) {
      setModalVisible(false);
    }
  }, [loading, isModalVisible]);
  const handleCompanyPress = (employeeID: string, companyID: string) => {
    navigation.navigate("Employee", { employeeID, companyID });
  };

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const pickDocument = async () => {
    try {
      let result = await DocumentPicker.getDocumentAsync({});
      console.log(result);

      // Check if the platform is not web before using expo-file-system
      if (Platform.OS !== "web") {
        const fileContent = await FileSystem.readAsStringAsync(
          result.assets[0].uri,
          { encoding: FileSystem.EncodingType.Base64 }
        );

        const workbook = XLSX.read(fileContent, { type: "base64" });

        // Assuming the first sheet is the one you want to convert
        const sheetName = workbook.SheetNames[0];

        // Convert sheet data to JSON
        const jsonData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {
          raw: false,
          dateNF: "YYYY-MM-DDTHH:mm:ss.SSSZ", // Format for parsing dates
        }) as Employee[];

        // Convert date serial numbers to JavaScript Date objects
        jsonData.forEach((employee) => {
          if (employee.date) {
            employee.date = XLSX.utils.dateNum(employee.date);
          }
        });

        // Set the converted data in state
        setConvertedData(jsonData);
        console.log("Data picked");
      } else {
        // Web platform - Use fetch to download file content
        const fileUri = result.assets[0].uri;

        if (fileUri) {
          const response = await fetch(fileUri);
          const buffer = await response.arrayBuffer();
          const binaryString = new Uint8Array(buffer).reduce(
            (data, byte) => data + String.fromCharCode(byte),
            ""
          );

          const workbook = XLSX.read(binaryString, { type: "binary" });
          const sheetName = workbook.SheetNames[1];

          // Convert sheet data to JSON
          const jsonData = XLSX.utils.sheet_to_json(
            workbook.Sheets[sheetName],
            {
              raw: false,
              dateNF: "YYYY-MM-DDTHH:mm:ss.SSSZ", // Format for parsing dates
            }
          ) as Employee[];

          // Convert date serial numbers to JavaScript Date objects
          jsonData.forEach((employee) => {
            if (employee.date) {
              employee.date = XLSX.utils.dateNum(employee.date);
            }
          });

          // Set the converted data in state
          setConvertedData(jsonData);
          console.log("Data picked");

          // Continue with the rest of your code to process the workbook
        } else {
          console.warn("Web platform detected, but file URI is missing.");
        }
      }
    } catch (error) {
      console.error("Error picking document:", error);
    }
  };

  const Submit = async () => {
    const hasEmptyKey = convertedData.some((item) =>
      Object.keys(item).some((key) => key.includes("__EMPTY"))
    );

    if (hasEmptyKey) {
      // Display an error message or handle the case where __EMPTY key is found
      console.error("Submission cannot be done because __EMPTY key is found.");
      return;
    } else {
      setLoading(true);
      setProgress({ current: 0, total: convertedData.length });
      console.log(convertedData);
      let current = 0;
      for (const employee of convertedData) {
        const EmployeeCollectionRef = collection(
          db,
          "Company",
          companyId,
          "Employee"
        );
        const customEmployeeName = employee["HN."];
        const EmployeeDocRef = doc(EmployeeCollectionRef, customEmployeeName);

        try {
          await setDoc(EmployeeDocRef, employee);
          console.log(
            `Employee with customEmployeeName ${customEmployeeName} uploaded successfully.`
          );

          const HealthCheckCollectionRef = collection(
            EmployeeDocRef,
            "HealthCheck"
          );
          const healthCheckPackageRef = doc(
            db,
            "HealthCheckPackage",
            employee["P."]
          );
          const healthCheckSubCollectionRef = collection(
            healthCheckPackageRef,
            "HealthCheck"
          );
          const healthCheckDocsSnapshot = await getDocs(
            healthCheckSubCollectionRef
          );

          healthCheckDocsSnapshot.forEach(async (healthCheckDoc) => {
            const HealthCheckDocRef = doc(
              HealthCheckCollectionRef,
              healthCheckDoc.id
            );
            const healthCheckData = healthCheckDoc.data();
            await setDoc(HealthCheckDocRef, healthCheckData);
          });

          console.log(
            `Health check data for employee ${customEmployeeName} uploaded successfully.`
          );
          setProgress({ current: current++, total: convertedData.length });
        } catch (error) {
          console.error(
            `Error uploading data for employee ${customEmployeeName}:`,
            error
          );
        }
      }
      setLoading(false);
      setModalVisible(true);
    }
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
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text>Employee Details:</Text>
            {convertedData && convertedData.length > 0 && (
              <View>
                {Object.entries(convertedData[0]).map(([key, value], index) => (
                  <Text
                    key={index}
                    style={key.includes("__EMPTY") ? { color: "red" } : {}}
                  >
                    {`${key} ${JSON.stringify(value)}`}
                  </Text>
                ))}
              </View>
            )}
            <Button
              title="Pick and Convert XLSX to JSON"
              onPress={pickDocument}
            />
            <Button title="Submit" onPress={Submit} />
            {loading && (
              <Text>
                Uploading: {progress.current}/{progress.total}
              </Text>
            )}
            <Button title="Close Modal" onPress={toggleModal} />
          </View>
        </View>
      </Modal>
      <TouchableOpacity style={styles.AddEmployee} onPress={toggleModal}>
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
