import { View, Text, Button, ScrollView, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import { QuerySnapshot, collection, getDocs } from 'firebase/firestore';
import { db } from '../database/config';


const Home: React.FC<any> = ({ navigation}) => {
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

  
  return (
    <View style={{backgroundColor: 'red'}}>
      <ScrollView style={{ maxHeight: 600 }}>
      {companies.map((company, index) => (
          <View key={index}>
            <Text>{company.id}</Text>
            <Text>ชื่อบริษัท: {company.name}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  )
}

export default Home