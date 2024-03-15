import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import BillingToPrint from "./BillingToPrint";
import { useReactToPrint } from "react-to-print";
import { Checkbox, TextInput } from "react-native-paper";
import { PaperSelect } from "react-native-paper-select";
import {
  collection,
  setDoc,
  onSnapshot,
  doc,
  getDocs,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../database/config";
import PackageList from "./PackageList";
const Biliing = ({ employeeData, companyId }) => {
  const [price, setPrice] = useState("");
  const componentBillingRef = useRef(null);
  const [firebaseData, setFirebaseData] = useState<HealthCheck[]>([]);
  const [Itemsselected, setSelectedItems] = useState<SelectedItems | null>(
    null
  );
  const [checked, setChecked] = React.useState(false);
  const [packageList, setPackageList] = useState<Package[]>([]);
  const handleSelection = (value: any) => {
    const selectedListWithoutIdAndValue = value.selectedList.map(
      ({ _id, value, ...rest }: ListItem) => rest
    );

    setSelectedItems({
      ...Itemsselected,
      text: value.text,
      selectedList: selectedListWithoutIdAndValue,
      error: "",
    });
  };
  useEffect(() => {
    const fetchData = async () => {
      const healthCheckCollection = collection(db, "HealthCheck");
      const unsubscribe = onSnapshot(healthCheckCollection, (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as HealthCheck[];
        setFirebaseData(data);
      });

      return () => {
        unsubscribe();
      };
    };

    const fetchPackages = async () => {
      const healthCheckPackageRef = collection(
        db,
        `Company/${companyId}/HealthCheckPackage`
      );

      const unsubscribe = onSnapshot(healthCheckPackageRef, (snapshot) => {
        const updatedPackageList = snapshot.docs.map((doc) => {
          const { Packagename, text, Totalprice } = doc.data();

          return {
            id: doc.id,
            Packagename,
            text,
            Totalprice,
          };
        });

        setPackageList(updatedPackageList);
      });

      return () => {
        unsubscribe();
      };
    };

    fetchPackages();
    fetchData();
  }, [companyId]);
  const handlePrintBilling = useReactToPrint({
    content: () => componentBillingRef.current,
  });
  const name = "คุณ " + employeeData.ชื่อจริง + " " + employeeData.นามสกุล;
  return (
    <View>
      <PaperSelect
        label="เลือกรายการตรวจ"
        arrayList={firebaseData.map((item) => ({
          _id: item.id.toString(),
          value: item.name,
          ...item,
        }))}
        value={Itemsselected ? Itemsselected.text : ""}
        onSelection={handleSelection}
        selectedArrayList={
          Itemsselected ? Itemsselected.selectedList : ([] as ListItem[])
        }
        multiEnable={true}
      />

      <TextInput label={"ราคา"} value={price} onChangeText={setPrice} />
      <Text>
        โอนจ่าย{" "}
        <Checkbox
          status={checked ? "checked" : "unchecked"}
          onPress={() => {
            setChecked(!checked);
          }}
        />
      </Text>
      <div
        style={{
          display: "none",
          width: "148mm",
          height: "210mm",
          pageBreakAfter: "always",
        }}
      >
        <BillingToPrint
          ref={componentBillingRef}
          name={name}
          order={employeeData.ลำดับ}
          paid={checked}
          selected={Itemsselected?.text}
          price={price}
        />
      </div>
      <TouchableOpacity style={styles.incard2} onPress={handlePrintBilling}>
        <Text>พิมพ์ใบเสร็จ </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Biliing;

const styles = StyleSheet.create({});
