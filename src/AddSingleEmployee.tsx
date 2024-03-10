import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { DatePickerInput } from "react-native-paper-dates";
import { TextInput, Button } from "react-native-paper";
import DropDown from "react-native-paper-dropdown";
import { addDoc, collection, doc, getDocs, setDoc } from "@firebase/firestore";
import { db } from "../database/config";

const AddSingleEmployee = (props: { companyId: any }) => {
  const { companyId } = props;
  const [showDropDown, setShowDropDown] = useState(false);
  const [showDropDown2, setShowDropDown2] = useState(false);
  const [healthCheckPackages, setHealthCheckPackages] = useState([]);
  const [employee, setEmployee] = useState({
    คำนำหน้า: "",
    ชื่อจริง: "",
    นามสกุล: "",
    "Hn.": "",
    "Vn.": "",
    "P.": "",
    "ว/ด/ปีเกิด": new Date(),
  });

  useEffect(() => {
    // Fetch HealthCheckPackage IDs from Firestore
    const fetchHealthCheckPackages = async () => {
      const healthCheckPackagesQuery = await collection(
        db,
        `Company/${companyId}/HealthCheckPackage`
      );
      const healthCheckPackagesSnapshot = await getDocs(
        healthCheckPackagesQuery
      );
      const packages = [];

      healthCheckPackagesSnapshot.forEach((doc) => {
        packages.push({ label: doc.id, value: doc.id });
      });

      setHealthCheckPackages(packages);
    };

    fetchHealthCheckPackages();
  }, [companyId]);

  const handleInputChange = (field, value) => {
    setEmployee((prevEmployee) => ({
      ...prevEmployee,
      [field]: value,
    }));
  };

  const handleDateChange = (date) => {
    setEmployee((prevEmployee) => ({
      ...prevEmployee,
      "ว/ด/ปีเกิด": date,
    }));
  };

  const handleLogEmployee = async () => {
    const formattedDate = employee["ว/ด/ปีเกิด"].toLocaleDateString("th-TH", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    const employeesQuery = await collection(
      db,
      `Company/${companyId}/Employee`
    );
    const employeesSnapshot = await getDocs(employeesQuery);

    // Find the highest order number
    let lastOrder = 0;
    employeesSnapshot.forEach((doc) => {
      const order = doc.data().ลำดับ;
      if (order && order > lastOrder) {
        lastOrder = order;
      }
    });

    // Increment the order for the new employee
    const newOrder = lastOrder + 1;
    const customEmployeeId = employee["Hn."];

    const employeeCopy = {
      ...employee,
      "ว/ด/ปีเกิด": formattedDate,
      ["ลำดับ"]: newOrder,
    };
    console.log(employeeCopy);
    const employeeDocRef = doc(
      db,
      `Company/${companyId}/Employee`,
      customEmployeeId
    );
    await setDoc(
      doc(db, `Company/${companyId}/Employee`, customEmployeeId),
      employeeCopy
    );

    const historyDocRef = doc(collection(employeeDocRef, "History"), "2024");
    await setDoc(historyDocRef, {
      status: "",
      Date: new Date(),
      // ... other HealthCheck information
    });
    const HealthCheckCollectionRef = collection(historyDocRef, "HealthCheck");
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
    const healthCheckDocsSnapshot = await getDocs(healthCheckSubCollectionRef);

    healthCheckDocsSnapshot.forEach(async (healthCheckDoc) => {
      const HealthCheckDocRef = doc(
        HealthCheckCollectionRef,
        healthCheckDoc.id
      );
      const healthCheckData = healthCheckDoc.data();
      await setDoc(HealthCheckDocRef, healthCheckData);
    });
  };

  const nameTitleList = [
    { label: "นาย", value: "นาย" },
    { label: "นาง", value: "นาง" },
    { label: "นางสาว", value: "นางสาว" },
  ];

  return (
    <View>
      <DropDown
        label={"คำนำหน้า"}
        visible={showDropDown}
        showDropDown={() => setShowDropDown(true)}
        onDismiss={() => setShowDropDown(false)}
        value={employee["คำนำหน้า"]}
        setValue={(value) => setEmployee({ ...employee, คำนำหน้า: value })}
        list={nameTitleList}
      />
      <TextInput
        label={"ชื่อจริง"}
        value={employee["ชื่อจริง"]}
        onChangeText={(text) => handleInputChange("ชื่อจริง", text)}
      />
      <TextInput
        label={"นามสกุล"}
        value={employee["นามสกุล"]}
        onChangeText={(text) => handleInputChange("นามสกุล", text)}
      />
      <TextInput
        label={"HN."}
        value={employee["Hn."]}
        onChangeText={(text) => handleInputChange("Hn.", text)}
      />
      <TextInput
        label={"VN."}
        value={employee["Vn."]}
        onChangeText={(text) => handleInputChange("Vn.", text)}
      />
      <DropDown
        label={"P."}
        visible={showDropDown2}
        showDropDown={() => setShowDropDown2(true)}
        onDismiss={() => setShowDropDown2(false)}
        value={employee["P."]}
        setValue={(text) => handleInputChange("P.", text)}
        list={healthCheckPackages}
      />
      <DatePickerInput
        locale="th"
        label="ว/ด/ปีเกิด"
        value={employee["ว/ด/ปีเกิด"]}
        onChange={(date) => handleDateChange(date)}
        inputMode="start"
      />
      <Button onPress={handleLogEmployee}>Log Employee</Button>
    </View>
  );
};

export default AddSingleEmployee;

const styles = StyleSheet.create({});
