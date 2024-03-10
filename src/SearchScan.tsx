import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { Button, Text } from "react-native-paper";
import { db } from "../database/config";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";

const SearchScan: React.FC = ({ route, navigation }) => {
  const { companyID, employeeID, year, healthCheckid } = route.params;
  const [employeeName, setEmployeeName] = useState("");
  const [healthCheckName, setHealthCheckName] = useState("");

  useEffect(() => {
    const fetchEmployeeAndHealthCheckData = async () => {
      // Fetch employee name
      const employeeDocRef = doc(
        db,
        `Company/${companyID}/Employee/${employeeID}`
      );
      const employeeDocSnapshot = await getDoc(employeeDocRef);

      if (employeeDocSnapshot.exists()) {
        const employeeData = employeeDocSnapshot.data();
        const fullName = `${employeeData["คำนำหน้า"]}${employeeData["ชื่อจริง"]} ${employeeData["นามสกุล"]}`;
        setEmployeeName(fullName);
      }

      // Fetch health check name and update CheckupStatus
      const healthCheckDocRef = doc(
        db,
        `Company/${companyID}/Employee/${employeeID}/History/${year}/HealthCheck/${healthCheckid}`
      );
      const healthCheckDocSnapshot = await getDoc(healthCheckDocRef);

      if (healthCheckDocSnapshot.exists()) {
        const healthCheckData = healthCheckDocSnapshot.data();
        setHealthCheckName(healthCheckData.name);

        // Update CheckupStatus to true
        await updateDoc(healthCheckDocRef, {
          CheckupStatus: true,
        });

        // If healthCheckid.type is "blood check", update CheckupStatus for all health checks with the same type
        if (healthCheckData.type === "blood check") {
          const bloodCheckCollectionRef = collection(
            db,
            `Company/${companyID}/Employee/${employeeID}/History/${year}/HealthCheck`
          );

          const bloodCheckQuerySnapshot = await getDocs(bloodCheckCollectionRef);

          const updatePromises = [];

          bloodCheckQuerySnapshot.forEach((bloodCheckDoc) => {
            const bloodCheckData = bloodCheckDoc.data();
            if (bloodCheckData.type === "blood check" && healthCheckid !== bloodCheckDoc.id) {
              updatePromises.push(
                updateDoc(bloodCheckDoc.ref, {
                  CheckupStatus: true,
                })
              );
            }
          });

          // Wait for all updates to complete
          await Promise.all(updatePromises);
        }
      }
    };

    fetchEmployeeAndHealthCheckData();
  }, [companyID, employeeID, year, healthCheckid]);

  return (
    <View style={styles.container}>
      <Text variant="titleLarge">การสแกนการตรวจสุขภาพเสร็จสมบูรณ์</Text>

      <View style={{ alignItems: "center" }}>
        <Text variant="titleMedium">ชื่อจริง {employeeName}</Text>
        <Text variant="titleMedium">ตรวจ {healthCheckName}</Text>
        <Text variant="titleMedium">ได้รับการสแกนเรียบร้อยแล้ว</Text>
      </View>

      <Button
        style={{ width: "100%" }}
        mode="contained"
        onPress={() => navigation.goBack()}
      >
        เสร็จสิ้น
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-around",
    alignItems: "center",
    padding: 10,
  },
});

export default SearchScan;
