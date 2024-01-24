import { ScrollView, StyleSheet, Text, TouchableOpacity, View ,Button} from 'react-native';
import { db } from '../database/config';
import { useEffect, useState } from 'react';
import { collection, getDocs, onSnapshot } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import React from 'react';

const CompanyListScreen: React.FC<any> =({ navigation })=>{
  const [companies, setCompanies] = useState<any[]>([]);
  const [numEmployees, setNumEmployees] = useState<Record<string, number>>({});
  const { navigate } = useNavigation();
  useEffect(() => {
    const fetchData = async () => {
      const companiesCollection = collection(db, 'Company');
      const unsubscribe = onSnapshot(companiesCollection, async (snapshot) => {
        const companiesData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        const employeeCounts: Record<string, number> = {};

        await Promise.all(
          companiesData.map(async (company) => {
            const employeesCollection = collection(db, 'Company', company.id, 'Employee');
            const employeesSnapshot = await getDocs(employeesCollection);
            employeeCounts[company.id] = employeesSnapshot.size;
          })
        );
        setNumEmployees(employeeCounts);
        setCompanies(companiesData);
        console.log(companiesData);

      });

      return () => {
        unsubscribe();
      };
    };
    fetchData();
  }, []);
  const handleCompanyPress = (companyId: string) => {
    // Navigate to the 'Company' component with the selected company's ID as a parameter
    console.log(companyId)
    navigation.navigate('Company', { companyId });

  };
    return(

      <View>
        <ScrollView style={{ height: '100%',width:'100%'}}>
          {companies.map((company, index) => (
            <TouchableOpacity style={styles.card} key={index} onPress={() => handleCompanyPress(company.id)}>
              <View style={styles.incard1}>
                <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{company.no}</Text>
              </View>
              <View style={styles.incard2}>
                <Text>ชื่อบริษัท: {company.name}</Text>
                <Text>จำนวน: {numEmployees[company.id]} คน</Text>
                <Text>วันที่:</Text>
              </View>
            </TouchableOpacity>
            ))}
        </ScrollView>  
            <Button
                title="Go to Details"
                onPress={() => navigation.navigate('Home')}
            />
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
export default CompanyListScreen