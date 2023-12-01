import React, { useState } from 'react';
import { StyleSheet, View, Button,ScrollView } from 'react-native';
import axios from 'axios';
import { getFromSecureStore } from "../Context/SensitiveDataStorage"; // Path might need to be adjusted
import { useNavigation } from '@react-navigation/native';
import { Alert } from 'react-native';
import config from '../Context/constants';
import EachItem from '../HostSubComponent/EachItem';


const URL = config.URL;
export default function AddItemHost() {
  const [items, setItems] = useState([{}]);
  const navigation = useNavigation();
  const handleAddItem = () => {
    // Check if the last item has all the necessary fields filled
    const lastItem = items[items.length - 1];
    if (lastItem.itemName && lastItem.itemCategory && lastItem.description && lastItem.specialIngredient  && lastItem.servingQuantity && lastItem.pricePerServe && lastItem.image) {
      setItems(prevItems => [...prevItems, {}]);
    } else {
      Alert.alert("Please fill in all fields for the last item before adding a new one");
    }
  };
  const handleSetData = (index, data) => {
    setItems(prevItems => {
      const updatedItems = [...prevItems];
      updatedItems[index] = data;
      return updatedItems;
    });
  };
  const handleSaveAndSubmit =async () => {
    const token = await getFromSecureStore('token');
    const uuidHost = await getFromSecureStore('uuidHost');  
    // Perform the necessary data processing and submission
  
    // Check if all items have their fields filled
    for (let item of items) {
      if (!(item.itemName && item.itemCategory && item.description && item.specialIngredient && item.servingQuantity && item.pricePerServe && item.image)) {
        Alert.alert("Please fill in all fields for all items before submitting");
        return;
      }
    }
  
    const dataToSubmit = items.map(item => {
      // Construct the data object to be submitted
      return {
        uuidItem: uuidHost,
        nameItem: item.itemName,
        dishcategory: item.itemCategory,
        description: item.description,
        specialIngredient: item.specialIngredient,
        vegetarian: item.isVeg,
        serveType: item.servingsType,
        serveQuantity: item.servingQuantity,
        amount: item.pricePerServe,
        DP: item.image,
      };
    });
  
    // Convert the data to JSON string
    const jsonData = JSON.stringify(dataToSubmit);
  
    // Set the headers to indicate JSON data
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
  
    // Submit the data using axios
    axios
      .post(`${URL}/host/menuItem`, jsonData, config)
      .then(response => {
        console.log('Data submitted successfully:' + JSON.stringify(response.data, null, 2));
        navigation.navigate('Dashboard');
      })
      .catch(error => {
        console.log('Error submitting data:', error);
      });
  };
  // const handleEdit = () => {
  //   // Handle the edit functionality
  // };

  const handleSubmit = (index, itemData) => {
    setItems(prevItems => {
      const updatedItems = [...prevItems];
      updatedItems[index] = itemData;
      return updatedItems;
    });
  };

  return (
    <ScrollView style={styles.container}>
      {items.map((item, index) => (
        <EachItem key={index} idx={index} onSubmit={handleSubmit} data={item} setData={handleSetData} />
      ))}
      <View style={styles.buttonContainer}>
        <Button title="Add another Item" onPress={handleAddItem} />
        <Button title="Save and Submit" onPress={handleSaveAndSubmit} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  buttonContainer: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});