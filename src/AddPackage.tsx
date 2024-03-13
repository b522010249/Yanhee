import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
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
import { Button, TextInput, Text } from "react-native-paper";

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

interface Package {
  Packagename: string;
  text: string;
  Totalprice: string;
}

const AddPackage: React.FC<any> = (props: { companyId: any }) => {
  const { companyId } = props;
  const [packageList, setPackageList] = useState<Package[]>([]);
  const [firebaseData, setFirebaseData] = useState<HealthCheck[]>([]);
  const [Packagename, setPackageName] = useState<string>("");
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [Itemsselected, setSelectedItems] = useState<SelectedItems | null>(null);

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

  const handleSelection = (value: any) => {
    const selectedListWithoutIdAndValue = value.selectedList.map(
      ({ _id, value, ...rest }: ListItem) => rest
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
  };

  const submitPackage = async () => {
    const packageData = {
      Packagename,
      text: Itemsselected?.text,
      Totalprice: totalPrice.toString(),
    };

    const packageDocRef = doc(db, `Company/${companyId}/HealthCheckPackage`, Packagename);

    await setDoc(packageDocRef, packageData, { merge: true });

    const healthCheckCollectionRef = collection(packageDocRef, "HealthCheck");
    const existingDocuments = await getDocs(healthCheckCollectionRef);

    existingDocuments.forEach(async (doc) => {
      await deleteDoc(doc.ref);
    });

    for (const healthCheck of Itemsselected.selectedList) {
      const healthCheckDocRef = doc(healthCheckCollectionRef, healthCheck.id);
      await setDoc(healthCheckDocRef, healthCheck);
    }
  };

  return (
    <View style={styles.main}>
      <View style={{ marginTop: 20 }}>
        <Text style={{ fontSize: 18, fontWeight: "bold" }}>Package List:</Text>
        {packageList.map((packageItem) => (
          <View key={packageItem.id} style={{ marginTop: 10 }}>
            <Text style={{ fontSize: 16 }}>{`Package: ${packageItem.Packagename}`}</Text>
            <Text style={{ fontSize: 16 }}>{`รายการครวจสุขภาพ: ${packageItem.text}`}</Text>
            <Text style={{ fontSize: 16 }}>{`ราคารวมทั้งหมด: ${packageItem.Totalprice}`}</Text>
          </View>
        ))}
      </View>
      <PaperSelect
        label="เลือกรายการตรวจ"
        arrayList={firebaseData.map((item) => ({ _id: item.id.toString(), value: item.id, ...item }))}
        value={Itemsselected ? Itemsselected.text : ""}
        onSelection={handleSelection}
        selectedArrayList={Itemsselected ? Itemsselected.selectedList : ([] as ListItem[])}
        multiEnable={true}
      />
      <View>
        <TextInput
          placeholder="กรอกชื่อแพ๊คเกจ"
          value={Packagename}
          onChangeText={(newText) => setPackageName(newText)}
        />
        <Text>{totalPrice}</Text>
      </View>
      <Button onPress={submitPackage}>Submit</Button>
    </View>
  );
};

export default AddPackage;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    padding: 15,
    margin: 10,
  },
});
