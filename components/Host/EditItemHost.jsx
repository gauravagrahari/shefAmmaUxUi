import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Button, ScrollView, Alert, TouchableOpacity, Text } from 'react-native';
import EditEachItem from '../HostSubComponent/EditEachItem';
import axios from 'axios';
import { getFromSecureStore } from "../Context/SensitiveDataStorage"; // Path might need to be adjusted
import { useNavigation } from '@react-navigation/native';
import config from '../Context/constants';

const URL = config.URL;

export default function EditItemHost() {
  const [items, setItems] = useState([]);
  const [originalItems, setOriginalItems] = useState([]);
  const [editingIndex, setEditingIndex] = useState(-1); // Add this to track the item that's currently being edited.
  const [editingItem, setEditingItem] = useState(null);  // <-- Add this line

  const navigation = useNavigation();

  useEffect(() => {
    const fetchData = async () => {
      const token = await getFromSecureStore('token');
      axios
        .get(`${URL}/guest/host/menuItems`, {
          headers: {
            'Content-Type': 'application/json',
            'id': 'item#78860e71-9e59-4c04-9d0b-aa300643dbe8',
            // 'Authorization': `Bearer ${token}`
          }
        })
        .then(response => {
          setItems(response.data);
          setOriginalItems(JSON.parse(JSON.stringify(response.data))); // creating a deep copy
        })
        .catch(error => {
          console.error(error);
        });
    };
    fetchData();
  }, []);

  const handleSetData = (index, data) => {
    setItems(prevItems => {
      const updatedItems = [...prevItems];
      updatedItems[index] = data;
      return updatedItems;
    });
  };

  const handleSaveAndSubmit = async () => {
    const token = await getFromSecureStore('token');
    const uuidHost = await getFromSecureStore('uuidHost'); 

    const incompleteItem = items.find(item => 
      !(item.itemName && item.itemCategory && item.description && item.servingQuantity && item.pricePerServe )
    );

    if (incompleteItem) {
        Alert.alert("Please fill in all fields for all items before submitting");
        return;
    }

    const originalItemsMap = new Map(originalItems.map(i => [i.uuidItem, i]));

    const itemsToUpdate = items.filter(i => {
      const originalItem = originalItemsMap.get(i.uuidItem);
      return i.uuidItem && originalItem && JSON.stringify(i) !== JSON.stringify(originalItem);
    });

    const config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
    };

    // If user edited existing item(s)
    if(itemsToUpdate.length > 0) {
        itemsToUpdate.forEach((item) => {
            axios
                .put(`${URL}/host/updateItem`, JSON.stringify(item), config)
                .then(response => {
                  console.log('Data updated successfully:' + JSON.stringify(response.data, null, 2));
                  const updatedItems = items.map(item => item.uuidItem === response.data.uuidItem ? response.data : item);
                  setItems(updatedItems);
                })
                .catch(error => {
                  console.log('Error updating data:', error);
                });
        });
    }
  };
  // Add a method to handle discarding changes:
  const handleDiscardChanges = () => {
    setItems(originalItems);
    setEditingIndex(-1);
  };
  return (
    <ScrollView contentContainerStyle={styles.container}>
    {items.map((item, index) => (
      <EditEachItem 
        key={index} 
        idx={index} 
        data={item} 
        setData={handleSetData} 
        disabled={editingItem !== null && editingItem !== index} // <-- Add this line
        onStartEditing={() => setEditingItem(index)} // <-- Add this line
        onStopEditing={() => setEditingItem(null)} // <-- Add this line
      />
    ))}
    <TouchableOpacity style={styles.button} onPress={handleSaveAndSubmit}>
      <Text style={styles.buttonText}>Save and Submit</Text>
    </TouchableOpacity>
  </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingTop: 10,
    paddingBottom: 20,
    width: '100%',
    backgroundColor: '#f2f2f2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    width: '70%',
    height: 40,
    marginBottom: 5,
    borderRadius: 5,
    backgroundColor: '#2ab2d1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
