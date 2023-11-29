import { collection, QuerySnapshot, getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { db } from '../database/config';

const Sticker: React.FC<any> = () => {
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
    <ScrollView>
        {companies.map((company, index) => (
          <View style={styles.sticker} key={index}>
            <View style={styles.box}>
              <Text style={styles.h_number}>{index}</Text>
              <Text>Barcode</Text>
            </View>
            <View style={styles.box2}>
              <Text>ชื่อ</Text>
            </View>
          </View>
        ))}
    </ScrollView>
  )
}
const styles = StyleSheet.create({
    sticker: {
      width: 2 * 72, // Convert inches to points (1 inch = 72 points)
      height: 1 * 72,
      borderWidth: 1,
      borderColor: 'black',
      marginBottom: 10,
    },
    box:{
      flex:4,
      backgroundColor: 'red',
      flexDirection:'row',
    },
    box2:{
      flex:6,
      backgroundColor: 'green',
      justifyContent: 'center',
    },
    h_number:{
      padding:4,
      transform: [{ rotate: '-90deg'}]
    },
  });
export default Sticker