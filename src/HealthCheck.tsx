import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { DataTable, FAB, Modal, Portal } from "react-native-paper";
import AddHeatlhCheck from "./AddHealthCheck";
import {
  collection,
  setDoc,
  onSnapshot,
  doc,
  addDoc,
} from "firebase/firestore";
import { db } from "../database/config";
const HealthCheck = () => {
  const [HealthCheck, setHealthCheck] = useState<any[]>([]);
  const [state, setState] = useState({ open: false });
  const [visible, setVisible] = useState(false);
  const onStateChange = ({ open }) => setState({ open });
  const { open } = state;
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const containerStyle = {
    backgroundColor: "rgba(255, 255, 255, 1)",
    padding: 20,
  };
  interface HealthCheck {
    id: any;
    name: string;
    nameeng: string;
    namecode: string;
    price: number;
    amount_sticker: number;
    codename: number;
  }
  useEffect(() => {
    const fetchData = async () => {
      const healthCheckCollection = collection(db, "HealthCheck");
      const unsubscribe = onSnapshot(healthCheckCollection, (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as HealthCheck[];
        setHealthCheck(data);
      });

      return () => {
        unsubscribe();
      };
    };
    fetchData();
  }, []);
  return (
    <View style={styles.container}>
      <DataTable>
        <DataTable.Header>
          <DataTable.Title>ชื่อตรวจสุขภาพ</DataTable.Title>
          <DataTable.Title>eng</DataTable.Title>
          <DataTable.Title numeric>ราคา</DataTable.Title>
          <DataTable.Title numeric>Action</DataTable.Title>
        </DataTable.Header>
        {HealthCheck.map((item) => (
        <DataTable.Row key={item.key}>
          <DataTable.Cell>{item.name}</DataTable.Cell>
          <DataTable.Cell>{item.codename}</DataTable.Cell>
          <DataTable.Cell numeric>{item.price}</DataTable.Cell>
          <DataTable.Cell numeric>{item.price}</DataTable.Cell>
        </DataTable.Row>
      ))}
      </DataTable>
      <Modal
        visible={visible}
        onDismiss={hideModal}
        contentContainerStyle={containerStyle}
      >
        <AddHeatlhCheck />
      </Modal>
      <Portal>
        <FAB.Group
          open={open}
          visible
          icon={open ? "calendar-today" : "plus"}
          actions={[
            {
              icon: "plus",
              label: "เพิ่มรายการตรวจสุขภาพ",
              onPress: showModal,
            },
            {
              icon: "bell",
              label: "Remind",
              onPress: () => console.log("Pressed notifications"),
            },
          ]}
          onStateChange={onStateChange}
          onPress={() => {
            if (open) {
              // do something if the speed dial is open
            }
          }}
        />
      </Portal>
    </View>
  );
};

export default HealthCheck;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
