import { Text, StyleSheet, TextInput, View, Modal, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { Picker } from "@react-native-picker/picker";
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
import HealthCheck from "./HealthCheck";
const AddExtra = () => {
  const [SelectedTitle, setSelectedTitle] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [firebaseData, setFirebaseData] = useState<HealthCheck[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
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
  const data = [
    'Item 1',
    'Item 2',
    'Item 3',
    // Add more items as needed
  ];
  const toggleItem = (item) => {
    const isSelected = selectedItems.includes(item);

    if (isSelected) {
      setSelectedItems(selectedItems.filter((selectedItem) => selectedItem !== item));
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  };
  return (
    <View style={styles.main}>
      <Text>บุคคลภายนอก</Text>
      <Picker
        selectedValue={SelectedTitle}
        onValueChange={(itemValue, itemIndex) => setSelectedTitle(itemValue)}
      >
        <Picker.Item label="นาย" value="นาย" />
        <Picker.Item label="นาง" value="นาง" />
        <Picker.Item label="นางสาว" value="นางสาว" />
      </Picker>
      <TextInput placeholder="กรอกชื่อ" style={styles.labeltext} />
      <TextInput placeholder="กรอกนามสกุล" style={styles.labeltext} />
      <TextInput placeholder="เบอร์โทร" style={styles.labeltext} />
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
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <Text>Show Picker</Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View>
          <Picker
            selectedValue={null} // Set selectedValue to null to avoid automatic selection
            onValueChange={(itemValue) => toggleItem(itemValue)}
            mode="dropdown"
            style={{ width: 200 }}
          >
            {data.map((item, index) => (
              <Picker.Item key={index} label={item} value={item} />
            ))}
          </Picker>

          <TouchableOpacity onPress={() => setModalVisible(false)}>
            <Text>Done</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <Text>Selected Items: {selectedItems.join(', ')}</Text>
    </View>
    </View>
  );
};

export default AddExtra;

const styles = StyleSheet.create({
  main: {
    padding: 15,
  },
  labeltext: {
    marginBottom: 10,
    height: 40,
    borderWidth: 2,
    paddingLeft: 5,
  },
});
