import React from "react";
import { View, StyleSheet } from "react-native";
import { Button, DefaultTheme, FAB, Icon, Portal, Text, TextInput, useTheme } from "react-native-paper";
const SearchScan: React.FC = () => {
  const [state, setState] = React.useState({ open: false });

  const onStateChange = ({ open }) => setState({ open });

  const { open } = state;
  
  const theme = {
    colors: {
      background: "transparent", 
      primary: '#019874', 
      secondary: '#4c6359', 
      tertiary: '#3F6375', 
    },
  };
  return (
    <View style={styles.container}>
      <Text variant="titleLarge">การสแกนการตรวจสุขภาพเสร็จสมบูรณ์</Text>
      <Icon color="green" source="check-circle" size={100} />
      <View style={{ alignItems: "center" }}>
        <Text variant="titleMedium">รายการตรวจสุขภาพ นาย จิรสิน คงสิริ</Text>
        <Text variant="titleMedium">ตรวจสารบ่งชี้มะเร็งตับ </Text>
        <Text variant="titleMedium">ได้รับการสแกนเรียบร้อยแล้ว</Text>
      </View>

      <Button
        style={{ width: "100%" }}
        mode="contained"
        onPress={() => console.log("Pressed")}
      >
        เสร็จสิ้น
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-around",
    alignItems: "center",
    padding: 10,
  },
});

export default SearchScan;
