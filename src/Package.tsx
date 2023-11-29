import { View, Text, Button, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { collection, QuerySnapshot, getDocs } from 'firebase/firestore';
import { db } from '../database/config';

const Package: React.FC<any> = () => {
  const [Package, setPackage] = useState<any[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      const Collection = collection(db, 'HealthCheckPackage');
      const Snapshot: QuerySnapshot = await getDocs(Collection);
      const Data = Snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setPackage(Data);
      console.log(Data)
    };

    fetchData();
  }, []);
  return (
    <View>
      {Package.map((data, index) => (
          <View key={index}>
            <TouchableOpacity>
            <Text>{data.id}</Text>
            </TouchableOpacity>
            
          </View>
        ))}
    </View>
  )
}

export default Package