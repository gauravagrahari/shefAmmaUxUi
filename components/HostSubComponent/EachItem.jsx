import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Alert, Image } from 'react-native';
import ImageUploader from '../commonMethods/ImageUploader';

export default function EachItem({ onSubmit, idx, data, setData }) {
  const [itemName, setItemName] = useState(data.itemName || '');
  const [itemCategory, setItemCategory] = useState(data.itemCategory || '');
  const [description, setDescription] = useState('');
  const [specialIngredient, setSpecialIngredient] = useState('');
  const [isVeg, setIsVeg] = useState(true);
  const [servingsType, setServingsType] = useState('piece');
  const [servingQuantity, setServingQuantity] = useState('');
  const [pricePerServe, setPricePerServe] = useState('');
  const [image, setImage] = useState(null);
  const [isEditing, setIsEditing] = useState(true);

  useEffect(() => {
    setData(idx, {
      itemName,
      itemCategory,
      description,
      specialIngredient,
      isVeg,
      servingsType,
      servingQuantity,
      pricePerServe,
      image,
    });
  }, [ itemName, itemCategory, description, specialIngredient, isVeg, servingsType, servingQuantity, pricePerServe, image,]);

  const handleSubmission = () => {
    if (itemName && itemCategory && description && specialIngredient && servingQuantity && pricePerServe && image) {
      const itemData = {
        itemName,
        itemCategory,
        description,
        specialIngredient,
        isVeg,
        servingsType,
        servingQuantity,
        pricePerServe,
        image,
      };
      onSubmit(itemData, idx);
      setIsEditing(false); // turn off editing after submission
    } else {
      Alert.alert("Please fill in all fields");
    }
  };

  const handleEdit = () => {
    setIsEditing(true); // allow editing when edit button clicked
  };

  const handleImageUpload = (imageData) => {
    setImage(imageData.uri);
  };

  return(
    <View contentContainerStyle={styles.container}>
      <Text style={styles.textField}>Item {idx + 1}</Text>
      {isEditing ? (
        <>
          <TextInput
            style={styles.input}
            placeholder="Item Name"
            value={itemName}
            onChangeText={setItemName}
          />
      <TextInput
        style={styles.input}
        placeholder="Item Category"
        value={itemCategory}
        onChangeText={setItemCategory}
      />
      <TextInput
        style={styles.input}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
      />
      <TextInput
        style={styles.input}
        placeholder="Special Ingredient"
        value={specialIngredient}
        onChangeText={setSpecialIngredient}
      />
      <View style={styles.radioContainer}>
      <View style={styles.radioPair}>
        <TouchableOpacity
          style={[styles.radioButton, isVeg ? styles.radioButtonSelected : null]}
          onPress={() => setIsVeg(true)}
        /> <Text style={styles.radioLabel}>Veg</Text></View>
         <View style={styles.radioPair}></View>
       <TouchableOpacity
          style={[styles.radioButton, !isVeg ? styles.radioButtonSelected : null]}
          onPress={() => setIsVeg(false)}
        /> <Text style={styles.radioLabel}>NonVeg</Text>
      </View>
      <View style={styles.radioContainer}>
      <View style={styles.radioPair}>
        <TouchableOpacity
          style={[styles.radioButton, servingsType === 'piece' ? styles.radioButtonSelected : null]}
          onPress={() => setServingsType('piece')}>
        
        </TouchableOpacity> 
         <Text style={styles.radioLabel}>Piece</Text>
         </View>
        <View style={styles.radioPair}>
        <TouchableOpacity
          style={[styles.radioButton, servingsType === 'plate' ? styles.radioButtonSelected : null]}
          onPress={() => setServingsType('plate')}
        >
        </TouchableOpacity>
          <Text style={styles.radioLabel}>Plate</Text></View>
          <View style={styles.radioPair}>

        <TouchableOpacity
          style={[styles.radioButton, servingsType === 'volume' ? styles.radioButtonSelected : null]}
          onPress={() => setServingsType('volume')}
        >
        </TouchableOpacity>
          <Text style={styles.radioLabel}>Volume(ml)</Text></View>
          <View style={styles.radioPair}>

        <TouchableOpacity
          style={[styles.radioButton, servingsType === 'weight' ? styles.radioButtonSelected : null]}
          onPress={() => setServingsType('weight')}
        >
        </TouchableOpacity>
          <Text style={styles.radioLabel}>Weight(gram)</Text></View>
      </View>
      <TextInput
        style={styles.input}
        placeholder="Enter Serving Quantity"
        value={servingQuantity}
        onChangeText={setServingQuantity}
      />
      <TextInput
        style={styles.input}
        placeholder="Price per serve"
        value={pricePerServe}
        onChangeText={setPricePerServe}
      />
       <ImageUploader onImageUpload={handleImageUpload} existingImage={image} />
          <TouchableOpacity style={styles.button} onPress={handleSubmission}>
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text style={styles.text}>{itemName}</Text>
          <Image source={{ uri: image }} style={styles.image} />
          <TouchableOpacity style={styles.button} onPress={handleEdit}>
            <Text style={styles.buttonText}>Edit</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexGrow: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 20,
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  textField: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#85a4ab',
    marginBottom: 5,
  },
  radioContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'gray',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioButtonSelected: {
    backgroundColor: 'gray',
  },
  radioLabel: {
    marginLeft: 5,
    fontSize: 16,
  }, 
   radioPair: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    marginBottom: 10,
  },
  button: {
    width: '50%',
    height: 40,
    marginBottom: 5,
    borderRadius: 5,
    // backgroundColor: '#2ab2d1',
    backgroundColor: '#009688',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 10,
  },
});
