// Test.js
import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { db } from "../database/config";
import { collection, onSnapshot } from "firebase/firestore";
import Sticker from "./Sticker";
import ReactToPrint, { useReactToPrint } from "react-to-print";

const Test = () => {
  const [employee, setEmployee] = useState([]);
  const companyId = "Infonet";
  const componentRef = useRef(null);
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "Company", companyId, "Employee"),
      (snapshot) => {
        const employeesData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setEmployee(employeesData);
      }
    );

    return () => unsubscribe(); // Cleanup on component unmount
  }, []);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  return (
    <View>
      <ReactToPrint
        trigger={() => (
          <TouchableOpacity onPress={handlePrint}>
            <Text>พิมพ์ทั้งหมด</Text>
          </TouchableOpacity>
        )}
        content={() => componentRef.current}
      />
      <div ref={componentRef}>
      {employee
  .slice() // Create a copy to avoid mutating the original array
  .sort((a, b) => b["ลำดับ"] - a["ลำดับ"]) // Sort employees based on the "ลำดับ" property
  .map((employee) => (
    <Sticker
      key={employee.id} // Make sure to provide a unique key for each sticker
      employeeID={employee.id}
      companyID={companyId}
    />
  ))}
      </div>
    </View>
  );
};

export default Test;

const testStyles = StyleSheet.create({
  test:{

  }
});
