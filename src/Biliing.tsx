import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useRef, useState } from "react";
import BillingToPrint from "./BillingToPrint";
import { useReactToPrint } from "react-to-print";
import { TextInput } from "react-native-paper";

const Biliing = ({ employeeData }) => {
    const [price, setPrice] = useState(""); 
  const componentBillingRef = useRef(null);
  const handlePrintBilling = useReactToPrint({
    content: () => componentBillingRef.current,
  });
  const name = "คุณ "+employeeData.ชื่อจริง+" "+employeeData.นามสกุล
  return (
    <View>
      <TextInput label={"ราคา"} value={price} onChangeText={setPrice} />
      <View style={{ display: "none" }}>
        {/* Forward the necessary props to BillingEmployee */}
        <BillingToPrint
          ref={componentBillingRef}
          employeeID={"123"}
          name={name}
          price={price}
        />
      </View>
      <TouchableOpacity style={styles.incard2} onPress={handlePrintBilling}>
        <Text>พิมพ์ใบเสร็จ </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Biliing;

const styles = StyleSheet.create({});
