import { StyleSheet, View } from "react-native";
import React, { useEffect, useState } from "react";
import DropDown from "react-native-paper-dropdown";
import { collection, getDocs, onSnapshot } from "firebase/firestore";
import { db } from "../database/config";
import { PaperSelect } from "react-native-paper-select";

interface PackageListProps {}
interface HealthCheck {
  id: any;
  name: string;
  nameeng: string;
  namecode: string;
  price: number;
  amount_sticker: number;
  codename: number;
}
interface SelectedItems {
  text: string;
  selectedList: ListItem[];
  error: string;
}
interface ListItem {
  _id: string;
  // Add other properties as needed
}
const PackageList: React.FC<PackageListProps> = () => {
  const companyId = "Energy Co.";
  const [packageIds, setPackageIds] = useState<string[]>([]);
  const [firebaseData, setFirebaseData] = useState<HealthCheck[]>([]);
  const [selectedPackageId, setSelectedPackageId] = useState<string>("1");
  const [showDropDown, setShowDropDown] = useState<boolean>(false);
  const [selectedHealthChecks, setSelectedHealthChecks] = useState<string[]>([]);
  const [Itemsselected, setSelectedItems] = useState<SelectedItems | null>(
    null
  );
  const transformedData = firebaseData.map((item) => ({
    _id: item.id.toString(), // adjust as needed
    value: item.id, // or any property that uniquely identifies the item
    ...item,
  }));
  useEffect(() => {
    const fetchPackageIds = async () => {
      const healthCheckPackageRef = collection(
        db,
        `Company/${companyId}/HealthCheckPackage`
      );
      
      const snapshot = await getDocs(healthCheckPackageRef);
    
      const packageList = snapshot.docs.map((doc) => {
        const data = doc.data();
        const { Packagename, text, Totalprice } = data;
    
        return {
          id: doc.id,
          Packagename,
          text,
          Totalprice,
        };
      });
    
      setPackageList(packageList);
    };
    const fetchSelectedHealthChecks = async () => {
      const packageRef = collection(db, `Company/${companyId}/HealthCheckPackage/${packageIds}`);
      const packageSnapshot = await getDocs(packageRef);
      const selectedChecks = packageSnapshot.docs.map((doc) => doc.id);
      setSelectedHealthChecks(selectedChecks);
    };
    fetchSelectedHealthChecks();
    fetchPackageIds();
  }, [companyId, selectedPackageId]);
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
    fetchData();
  }, []);
  return (
    <View>
      <DropDown
        showDropDown={() => setShowDropDown(true)}
        onDismiss={() => setShowDropDown(false)}
        label="Select Package ID"
        mode="outlined"
        visible={showDropDown}
        value={selectedPackageId}
        setValue={setSelectedPackageId}
        list={packageIds.map((id) => ({ label: id, value: id }))}
      />
      <PaperSelect
        label="เลือกรายการตรวจ"
        arrayList={transformedData}
        value={Itemsselected ? Itemsselected.text : ""}
        onSelection={(selectedItems) => {
          // Handle the selected items
          const selectedIds = selectedItems.map((item) => item.id);
          setSelectedHealthChecks(selectedIds);
          setSelectedItems({
            text: selectedItems.map((item) => item.name).join(', '), // Adjust as needed
            selectedList: selectedItems,
            error: "", // Adjust as needed
          });
        }}
        selectedArrayList={Itemsselected ? Itemsselected.selectedList : []}
        multiEnable={true}
      />
    </View>
  );
};

export default PackageList;

const styles = StyleSheet.create({});
