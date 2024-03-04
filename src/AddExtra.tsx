import { StyleSheet, View } from "react-native";
import React, { useEffect, useState } from "react";
import { DatePickerModal } from "react-native-paper-dates";
import { Button, TextInput, Text } from "react-native-paper";
//import SectionedMultiSelect from "react-native-sectioned-multi-select";
import Icon from "react-native-vector-icons/MaterialIcons";
import {
  collection,
  setDoc,
  onSnapshot,
  doc,
  addDoc,
} from "firebase/firestore";
import { db } from "../database/config";
import { DatePickerInput } from "react-native-paper-dates";
interface HealthCheck {
  name: string;
  price: number;
  code: any;
  id: number;
}
const AddExtra = () => {
  const [text, setText] = React.useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const [firebaseData, setFirebaseData] = useState<HealthCheck[]>([]);
  const [Packagename, setPackageName] = useState<any>([]);
  const [inputDate, setInputDate] = React.useState(new Date());

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

  return (
    <View>
      <View>
        <TextInput
          label="คำนำหน้า"
          value={text}
          onChangeText={(text) => setText(text)}
        />
        <TextInput
          label="ชื่อจริง"
          value={text}
          onChangeText={(text) => setText(text)}
        />
        <TextInput
          label="นามสกุล"
          value={text}
          onChangeText={(text) => setText(text)}
        />
        <TextInput
          label="เบอร์โทรติดต่อ"
          value={text}
          onChangeText={(text) => setText(text)}
        />
      </View>
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
      <Text variant="titleMedium">ราคารวมทั้งหมด:{calculateTotalPrice()}</Text>       
      <DatePickerInput
        locale="en-GB"
        label="Date"
        value={inputDate}
        onChange={(d) => setInputDate(d)}
        inputMode="start"
      />
      <Button>Submit</Button>
    </View>
  );
};

export default AddExtra;

const styles = StyleSheet.create({});
