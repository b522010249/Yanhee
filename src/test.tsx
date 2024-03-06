import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { db } from "../database/config";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
} from "firebase/firestore";
const test = () => {
  const [employeeIds, setEmployeeIds] = useState([]);

  useEffect(() => {
    const fetchEmployeeIds = async () => {
      const companyCollectionRef = collection(db, "Company", "SaengJun", "Employee");
      const employeeSnapshot = await getDocs(companyCollectionRef);

      const ids = employeeSnapshot.docs.map((doc) => doc.id);
      setEmployeeIds(ids);
      console.log(ids); // Log the employee IDs
    };

    fetchEmployeeIds();
  }, []);
  return (
    <View>
      <Text>test</Text>
    </View>
  )
}

export default test

const styles = StyleSheet.create({})