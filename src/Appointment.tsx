import { QuerySnapshot, getDocs, collectionGroup } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { Text, View } from 'react-native'
import { db } from '../database/config';

const Appointment:React.FC = () => {
    const [appointments, setAppointments] = useState<any[]>([]);
    useEffect(() => {
        const fetchData = async () => {
          const Collection = collectionGroup(db,'appointment');
          const Snapshot: QuerySnapshot = await getDocs(Collection);
          const Data = Snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
          setAppointments(Data);
          console.log(Data)
        };
    
        fetchData();
      }, []);
  return (
    <View>

    </View>
  )
}

export default Appointment