import { QuerySnapshot, getDocs, collectionGroup } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { Text, View} from 'react-native'
import { db } from '../database/config';
import { Calendar } from 'react-native-calendars';
import { Picker } from '@react-native-picker/picker';

const Appointment:React.FC = () => {
    const [appointments, setAppointments] = useState<any[]>([]);
    const [selectedValue, setSelectedValue] = useState('option1');
    useEffect(() => {
        const fetchData = async () => {
          const Collection = collectionGroup(db,'appointment');
          const Snapshot: QuerySnapshot = await getDocs(Collection);
          const Data = Snapshot.docs.map((doc) => ({ date: doc.id, ...doc.data() }));
          setAppointments(Data);
          console.log(Data)
        };
    
        fetchData();
      }, []);
  return (
    <View>
      <Picker
        selectedValue={selectedValue}
        onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}
      >
        <Picker.Item label="Option 1" value="option1" />
        <Picker.Item label="Option 2" value="option2" />
        <Picker.Item label="Option 3" value="option3" />
      </Picker>
      <Calendar
      onDayPress={date=>{
        console.log(date.dateString)
      }}
      markingType={'period'}
      markedDates={{
        '2023-12-24':{color:'red'}
      }}/>
    </View>
  )
}

export default Appointment