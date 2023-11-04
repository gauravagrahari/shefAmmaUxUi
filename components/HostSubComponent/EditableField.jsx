import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
const ItemView = ({ itemData, onEdit }) => {
    const {
      itemName,
      itemCategory,
      description,
      specialIngredient,
      isVeg,
      servings,
      servingsType,
      servingQuantity,
      pricePerServe,
      image,
    } = itemData;
  
    return (
      <View style={styles.container}>
        <Text style={styles.text}>{itemName || ''}</Text>
        <Text style={styles.text}>{itemCategory || ''}</Text>
        <Text style={styles.text}>{description || ''}</Text>
        <Text style={styles.text}>{specialIngredient || ''}</Text>
        <Text style={styles.text}>{isVeg ? 'Veg' : 'NonVeg'}</Text>
        <Text style={styles.text}>{servings || ''}</Text>
        <Text style={styles.text}>{servingsType || ''}</Text>
        <Text style={styles.text}>{servingQuantity || ''}</Text>
        <Text style={styles.text}>{pricePerServe || ''}</Text>
        <Text style={styles.text}>{image || ''}</Text>
        <TouchableOpacity style={styles.button} onPress={onEdit}>
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>
      </View>
    );
  };
  

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
  },
  text: {
    width: '100%',
    marginBottom: 10,
  },
  button: {
    backgroundColor: 'blue',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default ItemView;
