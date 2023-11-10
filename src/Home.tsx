import { View, Text, Button, ScrollView } from 'react-native'
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
    <View>
      <ScrollView style={{ maxHeight: 600 }}>
        {companies.map((company, index) => (
        <Text key={index}>{company.id}</Text>
        ))}
      </ScrollView>
      <Button
        title="Go to Package Screen"
        onPress={() => navigation.navigate('Package')}
      />
    </View>
  )
}

export default Home