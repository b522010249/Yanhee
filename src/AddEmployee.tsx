import { StyleSheet, View, Platform } from "react-native";
import React from "react";
import { useState } from "react";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import * as XLSX from "xlsx";
import { DefaultTheme, Text, Button, ProgressBar } from "react-native-paper";
import { collection, getDocs, setDoc, doc, getDoc } from "firebase/firestore";
import { db } from "../database/config";
import { DatePickerInput } from "react-native-paper-dates";

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
const AddEmployee = (props: { companyId: any }) => {
  const { companyId } = props;
  const [convertedData, setConvertedData] = useState<Employee[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [inputDate, setInputDate] = React.useState(new Date());

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
          dateNF: "dd/mmyyy", // Format for parsing dates
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
              cellDates: true, // Enable date parsing
              dateNF: "dd/mm/yyyy", // Format for parsing dates
            }
          );
          const formattedData = jsonData.map((row) => {
            return Object.fromEntries(
              Object.entries(row).map(([key, value]) => {
                if (value instanceof Date) {
                  // Format date as text, you can use any format you prefer
                  return [key, value.toLocaleDateString()];
                }
                return [key, value];
              })
            );
          });

          setConvertedData(formattedData);
          console.log(formattedData)
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
      for (const employee of convertedData as { [key: string]: any }[]) {
        employee["ลำดับ"] = Number(employee["ลำดับ"]);
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
          const HistoryCollectionRef = collection(EmployeeDocRef, "History");
          const day = inputDate.getDate();
          const month = inputDate.getMonth() + 1;
          const year = inputDate.getFullYear();
          const yearDocRef = doc(HistoryCollectionRef, year.toString());

          // Check if the document exists
          const yearDocSnapshot = await getDoc(yearDocRef);

          if (!yearDocSnapshot.exists()) {
            // If the document does not exist, create it
            await setDoc(yearDocRef, {
              date: day + "-" + month + "-" + year,
              status: "",
            });
          }

          const HealthCheckCollectionRef = collection(
            yearDocRef,
            "HealthCheck"
          );
          const healthCheckPackageRef = doc(
            db,
            "Company",
            companyId,
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
    }
  };
  return (
    <View>
      <View>
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

        <Button onPress={pickDocument}>Pick Excel name list</Button>
        <DatePickerInput
          locale="en-GB"
          label="Date"
          value={inputDate}
          onChange={(d) => setInputDate(d)}
          inputMode="start"
        />
        <Button onPress={Submit}>Submit</Button>
        {loading && (
          <View>
            <ProgressBar
              progress={progress.current / progress.total}
              color={DefaultTheme.colors.primary} // You can customize the color
            />
            <Text>
              Uploading: {progress.current}/{progress.total}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default AddEmployee;

const styles = StyleSheet.create({});
