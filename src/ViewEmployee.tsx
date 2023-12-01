import { collection, QuerySnapshot, getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { db } from '../database/config';

const ViewEmployee: React.FC<any> = ({navigation,route}) => {
  const companyid = route.params?.companyid;
  const [employee, setemployee] = useState<any[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      const employeeCollection = collection(db, 'company', companyid, 'employee');
      const employeeSnapshot: QuerySnapshot = await getDocs(employeeCollection);
      const employeeData = employeeSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setemployee(employeeData);
      console.log(employeeData)
    };

    fetchData();
  }, []);
  const handlePress = (employeeid: string) => {
    navigation.navigate('ViewAppointment', { employeeid,companyid });
  };

  return (
    <View>
      {employee.map((employee, index) => (
      <TouchableOpacity style={styles.card} key={index} onPress={() => handlePress(employee.id)}>
        <View>
        <Text>{employee.id}</Text>
          <Text>ชื่อ: {employee.name}</Text>
        </View>
      </TouchableOpacity>
      ))}
    </View>
  )
}
const styles = StyleSheet.create({
  card: {
    height:75,
    margin:10,
    backgroundColor:'green',
    padding:5,
    borderWidth: 3,
    borderRadius:10,
    borderColor: 'black',
  },
});
export default ViewEmployee