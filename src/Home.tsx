import { View, Text, Button, ScrollView, Pressable, TouchableOpacity, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { QuerySnapshot, collection, getDocs } from 'firebase/firestore';
import { db } from '../database/config';


const Home: React.FC<any> = ({ navigation }) => {
  const [companies, setCompanies] = useState<any[]>([]);
  
  useEffect(() => {
    const fetchData = async () => {
      const companiesCollection = collection(db, 'company');
      const companiesSnapshot: QuerySnapshot = await getDocs(companiesCollection);
      const companiesData = companiesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setCompanies(companiesData);
      console.log(companiesData)
    };

    fetchData();
  }, []);

  const handlePress = (companyid: string) => {
    navigation.navigate('ViewEmployee', { companyid });
  };
  return (
    <View>
      <ScrollView style={{ maxHeight: 600 }}>
      {companies.map((company, index) => (
        <TouchableOpacity style={styles.card} onPress={() => handlePress(company.id)} key={index}>
          <View>
            <Text>ชื่อบริษัท: {company.name}</Text>
            <Text>จำนวนพนักงาน</Text>
          </View>
        </TouchableOpacity>
        ))}
      </ScrollView>
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
export default Home