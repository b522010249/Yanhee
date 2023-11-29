import { collection, QuerySnapshot, getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { View, ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { db } from '../database/config';

const CompanyLists:React.FC<any> = ({ navigation }) => {
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
    const handlePress = () => {
        navigation.navigate('ViewEmployee');
    };
    
  return (
    <View>
      <ScrollView style={{ maxHeight: 600 }}>
      {companies.map((company, index) => (
        <TouchableOpacity style={styles.card} onPress={handlePress} key={index}>
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

export default CompanyLists