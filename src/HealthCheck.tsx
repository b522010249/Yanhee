import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Table, Row } from 'react-native-table-component';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../database/config';

interface HealthCheck {
  name: string;
  price: number;
  code: any;
  id: string;
  result: string;
}

const HealthCheck = () => {
  const [searchText, setSearchText] = useState<string>('');
  const [firebaseData, setFirebaseData] = useState<HealthCheck[]>([]);
  const [originalData, setOriginalData] = useState<HealthCheck[]>([]);
  const [editStatus, setEditStatus] = useState<{ [key: string]: boolean }>({});
  let searchTimeout: NodeJS.Timeout | null = null;

  useEffect(() => {
    const fetchData = async () => {
      const healthCheckCollection = collection(db, 'HealthCheck');
      const unsubscribe = onSnapshot(healthCheckCollection, (snapshot) => {
        const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as HealthCheck[];
        setFirebaseData(data);
        setOriginalData(data);
      });

      return () => unsubscribe();
    };

    fetchData();
  }, []);

  const handleEdit = (id: string, field: string, newValue: any) => {
    setEditStatus({ ...editStatus, [id]: true });
    const updatedData = firebaseData.map(item =>
      item.id === id ? { ...item, [field]: newValue } : item
    );
    setFirebaseData(updatedData);
  };

  const handleSave = async (id: string) => {
    try {
      // Your updateDoc logic here
      setEditStatus({ ...editStatus, [id]: false });
    } catch (error) {
      console.error('Error updating document: ', error);
    }
  };

  const handleCancel = (id: string) => {
    const originalItem = originalData.find(item => item.id === id);
    if (originalItem) setFirebaseData(firebaseData.map(item => (item.id === id ? originalItem : item)));
    setEditStatus({ ...editStatus, [id]: false });
  };

  const handleDelete = async (id: string) => {
    try {
      // Your deleteDoc logic here
    } catch (error) {
      console.error('Error deleting document: ', error);
    }
  };

  const handleSearch = (text: string) => {
    setSearchText(text);

    if (searchTimeout) clearTimeout(searchTimeout);

    searchTimeout = setTimeout(() => {
      const filteredData = originalData.filter(item =>
        Object.values(item).some(value =>
          value.toString().toLowerCase().includes(text.toLowerCase())
        )
      );
      setFirebaseData(filteredData);
      setEditStatus({});
    }, 300);
  };

  const handleClearSearch = () => {
    setSearchText('');
    setFirebaseData(originalData);
    setEditStatus({});
  };

  const renderActions = (item: HealthCheck) => {
    if (editStatus[item.id]) {
      return (
        <>
          <TouchableOpacity onPress={() => handleSave(item.id)}>
            <Text style={{ color: 'green', marginRight: 10 }}>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleCancel(item.id)}>
            <Text style={{ color: 'blue' }}>Cancel</Text>
          </TouchableOpacity>
        </>
      );
    } else {
      return (
        <TouchableOpacity onPress={() => handleDelete(item.id)}>
          <Text style={{ color: 'red' }}>Delete</Text>
        </TouchableOpacity>
      );
    }
  };

  return (
    <ScrollView style={{ flex: 1 }}>
      <View style={{ flex: 1, padding: 16}}>
        <View>
          <TextInput
            placeholder="Search"
            style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10, padding: 8 }}
            value={searchText}
            onChangeText={handleSearch}
          />
          <Table borderStyle={{ borderWidth: 1, borderColor: '#C1C0B9' }}>
            <Row
              data={['ชื่อโปรแกรมตรวจสุขภาพ', 'ราคา', 'code', 'Actions']}
              style={{height: 40,backgroundColor: '#f1f8ff'}}
              textStyle={{ fontSize: 12, fontWeight: 'bold',marginLeft:20}}
            />
            {firebaseData.map(item => (
              <Row
                key={item.id}
                style={{height: 40,}}
                textStyle={{ margin: 6}}
                data={[
                  <View style={{marginLeft:20}} >
                    <TextInput
                      value={item.name}
                      style={{fontSize:12}}
                      onChangeText={newName => handleEdit(item.id, 'name', newName)}
                    />
                  </View>,
                  <View style={{marginLeft:20}}>
                    <TextInput
                      value={item.price.toString()}
                      onChangeText={newPrice => handleEdit(item.id, 'price', parseFloat(newPrice))}
                    />
                  </View>,
                  <View style={{marginLeft:20}}>
                    <Text>
                      {item.code
                        ? item.code.map((codeItem: { name: any; }, index: any) => codeItem.name).join(' , ')
                        : ''}
                    </Text>                  
                  </View>,
                  <View style={{ flexDirection: 'row',marginLeft:20}}>
                    {renderActions(item)}
                  </View>,
                ]}
              />
            ))}
          </Table>
        </View>
      </View>
    </ScrollView>
  );
};

export default HealthCheck;

const styles = StyleSheet.create({});
