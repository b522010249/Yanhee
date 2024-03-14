import React from "react";
import { View, StyleSheet } from "react-native";
import { Text } from "react-native-paper";

const BillingToPrint = React.forwardRef(({ employeeID,price,name}, ref) => {
  return (
    <View style={styles.card} ref={ref}>
      <View style={styles.centeredContainer}>
        <Text variant="displaySmall">โรงพยาบาลยันฮี</Text>
        <Text>บริษัท โรงพยาบาลยันฮี จำกัด</Text>
        <Text>454 ถนนจรัญสนิทวงศ์ (ปากซอย 90) แขวงบางอ้อ</Text>
        <Text>เขตบางพลัด กรุงเทพมหานคร 10700 โทร. 0-2879-0300</Text>
        <Text>
          แฟกซ์ 0-2435-7545 เลขประจำตัวผู้เสียภาษี 3 0 1 1 3 9 1 0 0 6
        </Text>
        <View style={styles.rightAlign}>
          <Text>ลำดับ</Text>
        </View>
        <Text variant="displaySmall">ใบเสร็จรับเงิน</Text>
      </View>

      <View style={styles.borderedContainer}>
        <View style={styles.rightAlign}>
          <Text variant="titleLarge">วันที่ เดือน พ.ศ.</Text>
        </View>
        <View style={styles.spaceBetween}>
          <Text variant="titleLarge">ได้รับเงินจาก {name}</Text>
          <Text variant="titleLarge">ชำระค่า</Text>
          <Text variant="titleLarge">ชำระโดย</Text>
          <Text variant="titleLarge">เป็นจำนวนเงิน {price}</Text>
        </View>
        <View style={styles.rightAlign}>
          <Text variant="titleLarge">ผู้รับเงิน</Text>
        </View>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  card: {
    padding: 20,
    alignContent: "space-between",
    flex: 1,
    display: "flex",
    width: "100%",
  },
  centeredContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent:"space-between"
  },
  borderedContainer: {
    flex: 1,
    alignContent: "space-around",
    borderColor: "black",
    borderWidth: 1,
    padding: 20,
  },
  rightAlign: {
    alignSelf: "flex-end",
  },
  spaceBetween: {
    flex: 1,
    justifyContent: "space-around",
    alignContent: "space-around",
  },
});

export default BillingToPrint;
