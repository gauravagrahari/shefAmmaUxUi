import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image, Alert } from "react-native";
import ImageUploader from "../commonMethods/ImageUploader";

export default function EditEachItem({ idx, onSubmit, data, setData, disabled, onStartEditing, onStopEditing }) {
  const [nameItem, setNameItem] = useState(data.nameItem || ""), 
        [dishcategory, setDishcategory] = useState(data.dishcategory || ""), 
        [description, setDescription] = useState(data.description || ""), 
        [specialIngredient, setSpecialIngredient] = useState(data.specialIngredient || ""), 
        [vegetarian, setVegetarian] = useState(data.vegetarian || true), 
        [serveType, setServeType] = useState(data.serveType || "piece"), 
        [serveQuantity, setServeQuantity] = useState(data.serveQuantity || ""), 
        [amount, setAmount] = useState(data.amount || ""), 
        [dp, setDp] = useState(data.dp || null), 
        [unsavedChanges, setUnsavedChanges] = useState(false);
        const [isEditing, setIsEditing] = useState(false);

        useEffect(() => {
          setNameItem(data.nameItem || "");
          setDishcategory(data.dishcategory || "");
          setDescription(data.description || "");
          setVegetarian(data.vegetarian || true);
          setServeType(data.serveType || "piece");
          setServeQuantity(data.serveQuantity || "");
          setAmount(data.amount || "");
          setDp(data.dp || null);
        }, [data]);
      
  useEffect(() => {
    setData(idx, { nameItem, dishcategory, description, vegetarian, serveType, serveQuantity, amount, dp,specialIngredient });
    if (isEditing) 
    setUnsavedChanges(true);
  }, [nameItem, dishcategory, description, vegetarian, serveType, serveQuantity, amount, dp,specialIngredient]);

  const handleSubmission = () => {
    if (nameItem && dishcategory && description && serveQuantity && amount && dp && specialIngredient) {
      const itemData = { nameItem, dishcategory, description, vegetarian, serveType, serveQuantity, amount, dp ,specialIngredient};
      onSubmit(idx, itemData);
       setData(idx, itemData);
        setUnsavedChanges(false);
    } else { Alert.alert("Please fill in all fields"); }
  };
 const handleEdit = () => {
    // Set isEditing to true when edit button is pressed
    setIsEditing(true);
    onStartEditing();  // <-- Notify the parent component
  };
  const handleSave = () => {
    handleSubmission();
    setIsEditing(false);
    onStopEditing();  // <-- Notify the parent component
  };
  const handleImageUpload = (imageData) => { setDp(imageData.uri); };

  return (
    <View style={styles.container}>
    
      <Text style={styles.textField}>Item {idx + 1}</Text>
      <TextInput style={styles.input} placeholder="Item Name" value={nameItem} onChangeText={setNameItem} editable={!disabled} />
      <TextInput style={styles.input} placeholder="Item Category" value={dishcategory} onChangeText={setDishcategory} editable={!disabled} />
      <TextInput style={styles.input} placeholder="Description" value={description} onChangeText={setDescription} editable={!disabled} />
      <TextInput style={styles.input} placeholder="Special Ingredient" value={specialIngredient} onChangeText={setSpecialIngredient} editable={!disabled} />
      <View style={styles.radioContainer}>
        <Text style={styles.radioLabel}>Choose if your dish is veg or non veg</Text>
        <View style={styles.radioPair}><TouchableOpacity style={[styles.radioButton, vegetarian ? styles.radioButtonSelected : null]} onPress={() => setVegetarian(true)} /><Text style={styles.radioLabel}>Veg</Text></View>
        <View style={styles.radioPair}><TouchableOpacity style={[styles.radioButton, !vegetarian ? styles.radioButtonSelected : null]} onPress={() => setVegetarian(false)} /><Text style={styles.radioLabel}>NonVeg</Text></View>
      </View>
      <View style={styles.radioContainer}>
        <Text style={styles.radioLabel}>Choose the serve Type</Text>
        <View style={styles.radioPair}><TouchableOpacity style={[styles.radioButton, serveType === "piece" ? styles.radioButtonSelected : null]} onPress={() => setServeType("piece")} /><Text style={styles.radioLabel}>Piece</Text></View>
        <View style={styles.radioPair}><TouchableOpacity style={[styles.radioButton, serveType === "plate" ? styles.radioButtonSelected : null]} onPress={() => setServeType("plate")} /><Text style={styles.radioLabel}>Plate</Text></View>
        <View style={styles.radioPair}><TouchableOpacity style={[styles.radioButton, serveType === "volume" ? styles.radioButtonSelected : null]} onPress={() => setServeType("volume")} /><Text style={styles.radioLabel}>Volume(ml)</Text></View>
        <View style={styles.radioPair}><TouchableOpacity style={[styles.radioButton, serveType === "weight" ? styles.radioButtonSelected : null]} onPress={() => setServeType("weight")} /><Text style={styles.radioLabel}>Weight(gram)</Text></View>
      </View>
      <TextInput style={styles.input} placeholder="Enter Serving Quantity" value={serveQuantity} onChangeText={setServeQuantity} editable={!disabled} />
      <TextInput style={styles.input} placeholder="Price per serve" value={amount} onChangeText={setAmount} editable={!disabled} />
      <ImageUploader onImageUpload={handleImageUpload} existingImage={dp} disabled={disabled} />
      {/* {isEditing && <TouchableOpacity onPress={onCancel}><Text>Cancel</Text></TouchableOpacity>} */}
      {!isEditing && <TouchableOpacity onPress={handleEdit} disabled={disabled}>
        <Text>Edit</Text></TouchableOpacity>}
      {isEditing && <TouchableOpacity onPress={handleSave}><Text>Save</Text></TouchableOpacity>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flex: 1,
    flexGrow: 1,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    // borderBottomWidth: 1,
    borderBottomColor: "lightgrey",
    // borderWidth: 1,
    // borderColor: "lightgrey",
    backgroundColor: "#f0f0f0",
    marginBottom: 10,
  },
  input: {
    width: "100%",
    height: 40,
    borderColor: "#ccc",
    borderBottomWidth: 1,
    borderLeftWidth: 0,
    marginBottom: 10,
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
  },
  textField: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 10,
  },
  radioContainer: {
    flexDirection: "column",
    alignItems: "flex-start",
    marginBottom: 7,
    width: "90%",
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "gray",
    alignItems: "center",
    justifyContent: "center",
  },
  radioButtonSelected: {
    backgroundColor: "gray",
  },
  radioLabel: {
    marginLeft: 5,
    fontSize: 16,
    marginVertical: 3,
  },
  radioPair: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    marginBottom: 10,
  },
  button: {
    width: "50%",
    height: 40,
    marginBottom: 3,
    borderRadius: 5,
    backgroundColor: "#009688",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
