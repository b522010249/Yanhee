import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, TextInput, Button } from "react-native";

import SectionedMultiSelect from "react-native-sectioned-multi-select";
import Icon from "react-native-vector-icons/MaterialIcons";
import {
  collection,
  setDoc,
  onSnapshot,
  doc,
  addDoc,
} from "firebase/firestore";
import { db } from "../database/config";

interface HealthCheck {
  name: string;
  price: number;
  code: any;
  id: number;
}

const AddPackage: React.FC<any> = ({ navigation }) => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [firebaseData, setFirebaseData] = useState<HealthCheck[]>([]);
  const [Packagename, setPackageName] = useState<any>([]);

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
    firebaseData.forEach((item) => {
      console.log(`Name: ${item.name}, Price: ${item.price}`);
      if (item.code) {
        item.code.forEach((codeItem) => {
          console.log(`Code Name: ${codeItem.name}`);
        });
      }
    });
  }, [firebaseData]);

  const calculateTotalPrice = () => {
    let totalPrice = 0;
    selectedItems.forEach((itemId) => {
      const selectedItem = firebaseData.find((item) => item.id === itemId);
      if (selectedItem) {
        totalPrice += selectedItem.price;
      }
    });
    return totalPrice;
  };
  const Submit = async () => {
    // Map the unique identifiers to the corresponding items in firebaseData
    const selectedItemsInfo = selectedItems.map((itemId) => {
      const selectedItem = firebaseData.find((item) => item.id === itemId);
      return selectedItem;
    });
    console.log(selectedItemsInfo);

    const packageData = {
      Packagename,
      Totalprice: calculateTotalPrice(),
      // Healthcheck: selectedItemsInfo.map((item) => ({
      //   id: item?.id,
      //   name: item?.name,
      //   price: item?.price,
      //   code: item?.code,
      //   // Add more fields if needed
      // })),
    };
    const PackageDocRef = doc(db, "HealthCheckPackage", Packagename);
    await setDoc(PackageDocRef, packageData);
    const healthCheckCollectionRef = collection(PackageDocRef, "HealthCheck");

    // Add each health check as a document within the HealthCheck collection
    for (const healthCheck of selectedItemsInfo) {
      const HealthCheckDocRef = doc(
        healthCheckCollectionRef,
        healthCheck?.name
      );
      await setDoc(HealthCheckDocRef, healthCheck);
    }
  };
  return (
    <View style={styles.main}>
      <SectionedMultiSelect
        IconRenderer={Icon}
        items={firebaseData}
        selectedItems={selectedItems}
        onSelectedItemsChange={(items) => setSelectedItems(items)}
        uniqueKey="id"
        showDropDowns={true}
        styles={{
          button: {
            backgroundColor: "blue",
          },
        }}
      />
      <View>
        <Text>ราคารวมทั้งหมด: {calculateTotalPrice()}</Text>
        <TextInput
          placeholder="กรอกชื่อแพ๊คเกจ"
          value={Packagename.name}
          onChangeText={(newText) => setPackageName(newText)}
        />
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
