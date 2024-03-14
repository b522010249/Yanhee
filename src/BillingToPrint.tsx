import React from "react";
import { View, StyleSheet } from "react-native";
import { Text } from "react-native-paper";

const BillingToPrint = React.forwardRef(
  ({ employeeID, price, name, selected, paid, order }, ref) => {
    function convertToThaiBuddhistYear(year) {
      return year + 543;
    }
    function getThaiMonthAbbreviation(month) {
      const thaiMonths = [
        "ม.ค.",
        "ก.พ.",
        "มี.ค.",
        "เม.ย.",
        "พ.ค.",
        "มิ.ย.",
        "ก.ค.",
        "ส.ค.",
        "ก.ย.",
        "ต.ค.",
        "พ.ย.",
        "ธ.ค.",
      ];
      return thaiMonths[month - 1];
    }
    function numberToThaiText(number) {
      const thaiDigits = [
        "ศูนย์",
        "หนึ่ง",
        "สอง",
        "สาม",
        "สี่",
        "ห้า",
        "หก",
        "เจ็ด",
        "แปด",
        "เก้า",
      ];
      const thaiUnits = ["", "สิบ", "ร้อย", "พัน", "หมื่น", "แสน", "ล้าน"];
      let thaiText = "";

      // Convert the number to Thai text
      const digits = Array.from(String(number), Number);
      for (let i = 0; i < digits.length; i++) {
        const digit = digits[i];
        if (digit !== 0) {
          thaiText += thaiDigits[digit] + thaiUnits[digits.length - i - 1];
        }
      }

      return thaiText;
    }

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
            <Text>ลำดับ {order}</Text>
          </View>
          <Text variant="displaySmall">ใบเสร็จรับเงิน</Text>
        </View>

        <View style={styles.borderedContainer}>
          <View style={styles.rightAlign}>
            <Text variant="titleLarge">
              วันที่ {new Date().getDate()} เดือน{" "}
              {getThaiMonthAbbreviation(new Date().getMonth() + 1)} พ.ศ.{" "}
              {convertToThaiBuddhistYear(new Date().getFullYear())}
            </Text>
          </View>
          <View style={styles.spaceBetween}>
            <Text variant="titleLarge">
              ได้รับเงินจาก <Text > {name}</Text>
            </Text>
            <Text variant="titleLarge">
              ชำระค่า <Text >{selected}</Text>
            </Text>
            <Text variant="titleLarge">
              ชำระโดย{" "}
              <Text >{paid ? "การโอน" : "เงินสด"}</Text>
            </Text>
            <Text variant="titleLarge">
              เป็นจำนวนเงิน{" "}
              <Text >
                {price} ({numberToThaiText(price)})
              </Text>
            </Text>
          </View>
          <View style={styles.rightAlign}>
            <Text variant="titleLarge">ผู้รับเงิน ___________</Text>
          </View>
        </View>
      </View>
    );
  }
);

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
    justifyContent: "space-between",
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
  underline: {
    textDecorationLine: "underline",
  },
  text: {
    marginBottom: 8, // Space below the text
  },
});

export default BillingToPrint;
