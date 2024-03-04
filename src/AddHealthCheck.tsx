import { Keyboard, StyleSheet, View } from "react-native";
import React, { useState } from "react";
import { db } from "../database/config";
import { collection, doc, setDoc } from "firebase/firestore";
import { Button, Checkbox, TextInput } from "react-native-paper";

const AddHeatlhCheck: React.FC<any> = ({ navigation }) => {
  const [checked, setChecked] = React.useState(false);
  const [HealthCheck, SetHealthCheck] = useState<{
    name: string;
    nameeng: string;
    price: number;
    amount_sticker: number;
    details: { id: number }[];
    ResultsStatus: boolean;
    CheckupStatus: boolean;
  }>({
    name: "",
    nameeng: "",
    price: 0,
    amount_sticker: 1,
    code: [],
    ResultsStatus: false,
    CheckupStatus: false,
  });
  const Submit = async () => {
    try {
      // Creating a collection reference for HealthCheck parameters
      const healthCheckCollectionRef = collection(db, "HealthCheck");

      // Iterating over code array and adding individual documents
      for (const param of HealthCheck.code) {
        // Dynamically generating document ID based on the parameter name
        const paramDocRef = doc(healthCheckCollectionRef, param.name);

        // Creating a new object with shared properties and parameter-specific properties
        const paramData = {
          name: HealthCheck.name,
          nameeng: HealthCheck.nameeng,
          price: HealthCheck.price,
          amount_sticker: HealthCheck.amount_sticker,
          ResultsStatus: HealthCheck.ResultsStatus,
          CheckupStatus: HealthCheck.CheckupStatus,
          codename: param.name,
          Results: "",
          type: checked ? "blood check" : "",
        };

        // Ensure all properties are defined before setting the document data
        Object.keys(paramData).forEach((key) => {
          if (paramData[key] === undefined) {
            delete paramData[key];
          }
        });

        // Setting the document data
        await setDoc(paramDocRef, paramData);
      }

      console.log("Data added/updated successfully!");
      Keyboard.dismiss();
    } catch (error) {
      console.error("Error adding/updating data:", error.message);
    }
  };
  const handleAddInput = () => {
    const newId = HealthCheck.code.length + 1;
    SetHealthCheck((prevHealthCheck) => ({
      ...prevHealthCheck,
      code: [...prevHealthCheck.code, { id: newId }],
    }));
  };
  return (
    <View style={styles.main}>
      <TextInput
        label="กรอกชื่อรายการตรวจสุขภาพ"
        mode="outlined"
        value={HealthCheck.name}
        onChangeText={(newText) =>
          SetHealthCheck({ ...HealthCheck, name: newText })
        }
      />
      <TextInput
        label="กรอกชื่อรายการตรวจสุขภาพeng"
        mode="outlined"
        value={HealthCheck.nameeng}
        onChangeText={(newText) =>
          SetHealthCheck({ ...HealthCheck, nameeng: newText })
        }
      />
      <TextInput
        label="กรอกราคา"
        mode="outlined"
        keyboardType="numeric"
        value={HealthCheck.price.toString()}
        onChangeText={(newText) =>
          SetHealthCheck({ ...HealthCheck, price: parseFloat(newText) || 0 })
        }
      />
      <TextInput
        label="กรอกจำนวนสติกเกอร์"
        mode="outlined"
        keyboardType="numeric"
        value={HealthCheck.amount_sticker.toString()}
        onChangeText={(newText) =>
          SetHealthCheck({
            ...HealthCheck,
            amount_sticker: parseFloat(newText) || 0,
          })
        }
      />
      <Checkbox
        status={checked ? "checked" : "unchecked"}
        onPress={() => {
          setChecked(!checked);
        }}
      />
      <Button mode="outlined" onPress={handleAddInput}>
        Add Code
      </Button>
      {HealthCheck.code.map((input) => (
        <TextInput
          key={input.id}
          placeholder={`Enter text for Input ${input.id}`}
          style={styles.labeltext}
          onChangeText={(newText) =>
            SetHealthCheck((prevHealthCheck) => ({
              ...prevHealthCheck,
              code: prevHealthCheck.code.map((item) =>
                item.id === input.id ? { ...item, name: newText } : item
              ),
            }))
          }
        />
      ))}
      <Button mode="outlined" onPress={Submit}>
        submit
      </Button>
    </View>
  );
};

export default AddHeatlhCheck;

const styles = StyleSheet.create({
  main: {
    padding: 15,
  },
});
