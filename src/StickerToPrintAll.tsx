import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { db } from "../database/config";
import { collection, onSnapshot } from "firebase/firestore";
import Sticker from "./Sticker";
import ReactToPrint, { useReactToPrint } from "react-to-print";

const StickerToPrintAll = ({ companyID }) => {
  const componentRefs = useRef([]);
  const [employee, setEmployee] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "Company", companyID, "Employee"),
      (snapshot) => {
        const employeesData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setEmployee(employeesData);
        componentRefs.current = employeesData.map(() => React.createRef());
      }
    );

    return () => unsubscribe(); // Cleanup on component unmount
  }, []);

  // Function to handle printing
  const handlePrint = useReactToPrint({
    content: () => componentRefs.current
      .filter(ref => ref && ref.current)
      .map(ref => ref.current),
  });

  return (
    <View>
      <ReactToPrint
        trigger={() => (
          <TouchableOpacity onPress={handlePrint}>
            <Text>พิมพ์ทั้งหมด</Text>
          </TouchableOpacity>
        )}
        content={() => componentRefs.current.filter(ref => ref && ref.current).map(ref => ref.current)}
      />
      <div style={{ display: "none" }}>
        {employee.map((employeeData, index) => (
          <Sticker
          ref={componentRefs.current[index]}
            key={employeeData.id}
            employeeID={employeeData.id}
            companyID={companyID}
          />
        ))}
      </div>
    </View>
  );
};

export default StickerToPrintAll;

const testStyles = StyleSheet.create({
  test: {},
});
