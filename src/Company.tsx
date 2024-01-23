import { ScrollView, StyleSheet, Text, TouchableOpacity, View ,Button} from 'react-native';
import { db } from '../database/config';
import { useEffect, useState } from 'react';
import { collection, getDocs, onSnapshot } from 'firebase/firestore';
import React from 'react';

interface Employee {
  id: string;
  name: string;
}

const Company: React.FC<any> =({ route })=>{
  const { companyId } = route.params;
  const [employees, setEmployees] = useState<Employee[]>([]);
  useEffect(() => {
    const fetchEmployees = async () => {
      const employeesCollection = collection(db, 'company', companyId, 'employee');
      const employeesSnapshot = await getDocs(employeesCollection);
      const employeesData = employeesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Employee));
      setEmployees(employeesData);
    };

    fetchEmployees();
  }, [companyId]);
    return(
      <View>
        <ScrollView style={{ height: '100%',width:'100%'}}>
          {employees.map((employee) => (
            <TouchableOpacity style={styles.card} key={employee.id}>

              <View style={styles.incard2}>
                <Text>ชื่อ: {employee.name}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    width:'auto',
    height:75,
    marginBottom:10,
    backgroundColor: '#f2f2f2',
    borderBottomColor:'#e3e3e3',
    borderBottomWidth:2,
    padding:5,
    flexDirection:'row',
  },
  incard1 :{
    flex:1,
    padding:10,
    alignItems:'center',
    justifyContent:'center',
  },
  incard2 :{
    flex:9,
    marginLeft:10,
    justifyContent:'center',

  }
});
export default Company