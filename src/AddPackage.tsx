import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, TextInput, Button } from "react-native";

import { PaperSelect } from "react-native-paper-select";

import Icon from "react-native-vector-icons/MaterialIcons";
import { collection, setDoc, onSnapshot, doc } from "firebase/firestore";
import { db } from "../database/config";

interface HealthCheck {
  id: any;
  name: string;
  nameeng: string;
  namecode: string;
  price: number;
  amount_sticker: number;
  codename: number;
}
interface ListItem {
  _id: string;
  // Add other properties as needed
}
interface SelectedItems {
  text: string;
  selectedList: ListItem[];
  error: string;
}
const AddPackage: React.FC<any> = ({ navigation }) => {
  const [firebaseData, setFirebaseData] = useState<HealthCheck[]>([]);
  const [Packagename, setPackageName] = useState<string>("");
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [Itemsselected, setSelectedItems] = useState<SelectedItems | null>(
    null
  );
  const transformedData = firebaseData.map((item) => ({
    _id: item.id.toString(), // adjust as needed
    value: item.id, // or any property that uniquely identifies the item
    ...item,
  }));

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
  useEffect(() => {
    console.log(firebaseData);
  }, [firebaseData]);

  const Submit = async () => {
    // Map the unique identifiers to the corresponding items in firebaseData
    console.log(Itemsselected);
    const packageData = {
      Packagename,
      text: Itemsselected?.text,
      Totalprice: totalPrice.toString(),
    };
    const PackageDocRef = doc(db, "HealthCheckPackage", Packagename);
    await setDoc(PackageDocRef, packageData);
    const healthCheckCollectionRef = collection(PackageDocRef, "HealthCheck");
    for (const healthCheck of Itemsselected.selectedList) {
      const HealthCheckDocRef = doc(healthCheckCollectionRef, healthCheck.id);
      await setDoc(HealthCheckDocRef, healthCheck);
    }
  };

  return (
    <View style={styles.main}>
      <PaperSelect
        label="เลือกรายการตรวจ"
        arrayList={transformedData}
        value={Itemsselected ? Itemsselected.text : ""}
        onSelection={(value: any) => {
          const selectedListWithoutIdAndValue = value.selectedList.map(
            (selectedItem: ListItem) => {
              const { _id, value, ...rest } = selectedItem;
              return rest;
            }
          );
          const newTotalPrice = selectedListWithoutIdAndValue.reduce(
            (total, selectedItem) => total + selectedItem.price,
            0
          );
          setTotalPrice(newTotalPrice);

          setSelectedItems({
            ...Itemsselected,
            text: value.text,
            selectedList: selectedListWithoutIdAndValue,
            error: "",
          });
        }}
        selectedArrayList={
          Itemsselected ? Itemsselected.selectedList : ([] as ListItem[])
        }
        multiEnable={true}
      />
      <View>
        <TextInput
          placeholder="กรอกชื่อแพ๊คเกจ"
          value={Packagename.name}
          onChangeText={(newText) => setPackageName(newText)}
        />
        <Text>{totalPrice}</Text>
      </View>
      <Button title="Submit" onPress={Submit} />
    </View>
  );
};

export default AddPackage;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    padding: 15,
  },
});
