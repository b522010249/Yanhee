import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { db } from './database/config';
import { useEffect, useState } from 'react';
import { collection, QuerySnapshot, getDocs, onSnapshot } from 'firebase/firestore';

export default function App() {
  const [companies, setCompanies] = useState<any[]>([]);
  const [numEmployees, setNumEmployees] = useState<Record<string, number>>({});
  useEffect(() => {
    const fetchData = async () => {
      const companiesCollection = collection(db, 'company');
      const unsubscribe = onSnapshot(companiesCollection, async (snapshot) => {
        const companiesData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        const employeeCounts: Record<string, number> = {};

        await Promise.all(
          companiesData.map(async (company) => {
            const employeesCollection = collection(db, 'company', company.id, 'employee');
            const employeesSnapshot = await getDocs(employeesCollection);
            employeeCounts[company.id] = employeesSnapshot.size;
          })
        );
        setNumEmployees(employeeCounts);
        setCompanies(companiesData);
        console.log(companiesData);
        
      });
  
      return () => {
        // Unsubscribe from the snapshot listener when the component unmounts
        unsubscribe();
      };
    };
  
    fetchData();
  }, []);
  return (
    <View style={styles.container}>
      <ScrollView style={{ height: '100%',width:'100%'}}>
      {companies.map((company, index) => (
        <TouchableOpacity style={styles.card} key={index}>
          <View style={styles.incard1}>
            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{company.no}</Text>
          </View>
          <View style={styles.incard2}>
            <Text>ชื่อบริษัท: {company.name}</Text>
            <Text>{numEmployees[company.id]}</Text>
            <Text>วันที่เข้านัดตวจ</Text>
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
    width:250,
    alignSelf:'center',
    margin:10,
    backgroundColor:'pink',
    padding:10,
    borderWidth: 3,
    borderRadius:10,
    borderColor: 'black',

    flexDirection:'row',
  },
  incard1 :{
    flex:1,
    alignItems:'center',
    justifyContent:'center',
  },
  incard2 :{
    flex:5,
    alignItems:'flex-end',

  }
});
