// Sticker.js
import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import QRCode from "react-native-qrcode-svg";
import { db } from "../database/config";
import { collection, doc, getDoc, getDocs, onSnapshot } from "firebase/firestore";
import { useReactToPrint } from "react-to-print";

const Sticker = ({ employeeID, companyID }, ref) => {
  const componentRef = useRef(null);
  const namepe = "ตรวจปัสสาวะ";
  const year = "2024";
  const [employeeData, setEmployeeData] = useState({});
  const [HealthCheckData, setHealthCheckData] = useState([]);

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const employeeDocRef = doc(db, "Company", companyID, "Employee", employeeID);
        const employeeDocSnapshot = await getDoc(employeeDocRef);

        if (employeeDocSnapshot.exists()) {
          const employeeData = employeeDocSnapshot.data();
          setEmployeeData(employeeData);
        } else {
          console.log("Employee document does not exist.");
        }

        const HealthCheckCollection = collection(
          db,
          "Company",
          companyID,
          "Employee",
          employeeID,
          "History",
          year,
          "HealthCheck"
        );
        const unsubscribe = onSnapshot(HealthCheckCollection, (snapshot) => {
          const healthCheckData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          const bloodCheckData = healthCheckData.filter(
            (entry) => entry.type === "blood check"
          );
          const otherCheckData = healthCheckData.filter(
            (entry) => entry.type !== "blood check"
          );

          const firstBloodCheckEntry =
            bloodCheckData.length > 0 ? [bloodCheckData[0]] : [];

          const updatedHealthCheckData = [
            ...firstBloodCheckEntry,
            ...otherCheckData,
          ];

          setHealthCheckData(updatedHealthCheckData);
          console.log(updatedHealthCheckData);
        });

        return () => {
          unsubscribe();
        };
      } catch (error) {
        console.error("Error fetching employee document:", error);
      }
    };

    fetchDocument();
  }, [companyID, employeeID, year]);
  useReactToPrint({
    content: () => ref.current,
  });
  return (
    <View ref={ref}>
      {HealthCheckData.map((healthCheck, index) => {
        const { amount_sticker, name, type } = healthCheck;

        const stickerElements = Array.from(
          { length: amount_sticker },
          (_, i) => (
            <View key={i} style={styles.sticker}>
              <View style={styles.topContainer}>
                <View style={styles.leftContainer}>
                  <Text style={styles.text}>
                    ลำดับที่: {employeeData["ลำดับ"]}
                  </Text>
                  <Text style={{ ...styles.text, fontSize: 16 }}>
                    {employeeData["คำนำหน้า"]} {employeeData["ชื่อจริง"]}
                    {"\n"}
                    {employeeData["นามสกุล"]}
                  </Text>
                </View>
                <View style={styles.rightContainer}>
                  <QRCode
                    value={
                      companyID +
                      "/" +
                      employeeData["HN."] +
                      "/" +
                      year +
                      "/" +
                      healthCheck.id
                    }
                    size={60}
                  />
                </View>
              </View>
              <View style={styles.bottomContainer}>
                {type === "blood check" ? (
                  <Text style={{ ...styles.text, fontSize: 16 }}>
                    ตรวจรายการเจาะเลือด
                  </Text>
                ) : healthCheck.id === "PE" ? (
                  <Text style={{ ...styles.text, fontSize: 16 }}>
                    {employeeData["HN."]} {employeeData["ว/ด/ปีเกิด"]}
                  </Text>
                ) : healthCheck.id === "UA" ? (
                  <Text style={{ ...styles.text, fontSize: 16 }}>
                    {employeeData["HN."]} {namepe}
                  </Text>
                ) : (
                  <Text style={{ ...styles.text, fontSize: 16 }}>{name}</Text>
                )}
              </View>
            </View>
          )
        );

        return stickerElements;
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  sticker: {
    flexDirection: "column",
    marginLeft: 15,
  },
  leftContainer: {
    flex: 1.5,
    justifyContent: "center",
    width: 150,
    flexWrap: "wrap",
  },
  rightContainer: {
    flex: 1,
    alignItems: "flex-end",
  },
  text: {
    fontSize: 18,
  },
  topContainer: {
    flex: 3,
    flexDirection: "row",
  },
  bottomContainer: {
    flex: 1,
  },
});

export default React.forwardRef(Sticker);
