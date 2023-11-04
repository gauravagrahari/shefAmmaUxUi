import React, { useState } from 'react';
import { Modal, Button, StyleSheet, Text, View, TouchableOpacity, FlatList, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');
const ITEM_HEIGHT = 50; // Height of one item, including padding/margin

const Dropdown = ({ items, selectedValue, onValueChange, placeholder }) => {
  const [modalVisible, setModalVisible] = useState(false);

  const handleSelect = (value) => {
    onValueChange(value);
    setModalVisible(false);
  }

  // Calculate modal height based on items
  const modalHeight = Math.min(Math.max(items.length, 4) * ITEM_HEIGHT, ITEM_HEIGHT * 12);

  return (
    <View style={styles.container}>
      <Button title={selectedValue || placeholder} onPress={() => setModalVisible(true)} />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
      >
        <View style={styles.centeredView}>
          <View style={[styles.modalView, { height: modalHeight }]}>
            <FlatList
              data={items}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => handleSelect(item)} style={styles.modalItem}>
                  <Text style={styles.modalText}>{item}</Text>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item}
              showsVerticalScrollIndicator={false}
            />
            <Button title="Close" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: width * 0.8, // Adjusted to 80% of the screen width
  },
  modalText: {
    textAlign: "center"
  },
  modalItem: {
    paddingVertical: 15,
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
    width: '100%'
  },
  button: {
    // Add button styling if necessary
  },
});

export default Dropdown;
