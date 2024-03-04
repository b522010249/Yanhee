import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { DataTable, FAB, Modal, Portal } from "react-native-paper";
import AddHeatlhCheck from "./AddHealthCheck";

const HealthCheck = () => {
  const [state, setState] = React.useState({ open: false });
  const [visible, setVisible] = React.useState(false);
  const onStateChange = ({ open }) => setState({ open });
  const { open } = state;
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  

  const containerStyle = {
    backgroundColor: "rgba(255, 255, 255, 1)",
    padding: 20,
  };
  return (
    <View style={styles.container}>
      <DataTable>
        <DataTable.Header>
          <DataTable.Title>ชื่อตรวจสุขภาพ</DataTable.Title>
          <DataTable.Title>ไทย</DataTable.Title>
          <DataTable.Title>eng</DataTable.Title>
          <DataTable.Title numeric>ราคา</DataTable.Title>
          <DataTable.Title numeric>Action</DataTable.Title>
        </DataTable.Header>
      </DataTable>
      <Modal
        visible={visible}
        onDismiss={hideModal}
        contentContainerStyle={containerStyle}
      >
        <AddHeatlhCheck/>
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
