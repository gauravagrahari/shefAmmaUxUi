import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Button, StyleSheet } from 'react-native';

export const EditableText = ({ value, onSave}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [localValue, setLocalValue] = useState(value); // Add this line

  const handleSave = () => {
    setIsEditing(false);
    onSave(localValue); // change 'value' to 'localValue'
    console.log(localValue);
  };
  

  return isEditing ? (
    <View style={styles.editableContainer}>
      <TextInput 
        value={localValue} // change 'value' to 'localValue'
        onChangeText={setLocalValue} // change 'setValue' to 'setLocalValue'
        style={styles.textInput}
        // placeholder={placeholder}
      />
      <TouchableOpacity onPress={handleSave} style={styles.button}>
        <Text style={styles.buttonText}>Save</Text>
      </TouchableOpacity>
    </View>
  ) : (
    <View style={styles.editableContainer}>
      <Text style={styles.text}>{value}</Text>
      <TouchableOpacity onPress={() => {setIsEditing(true); setLocalValue(value);}} style={styles.button}>
        <Text style={styles.buttonText}>Edit</Text>
      </TouchableOpacity>
    </View>
  );
};


const styles = StyleSheet.create({
  editableContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'gray',
    padding: 5,
    marginRight: 10,
  },
  button: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  text: {
    fontSize: 16,
  },
});
