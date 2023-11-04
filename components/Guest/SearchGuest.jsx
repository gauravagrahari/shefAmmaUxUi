import React, { useCallback, useEffect, useState } from "react";
import {
  Button,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import axios from "axios";
import { useFocusEffect } from "@react-navigation/native";
import HostCard from "../GuestSubComponent/HostCard";

export default function SearchGuest({ navigation, route,prop }) {
  const [searchText, setSearchText] = useState("");
  const [radius, setRadius] = useState("");
  const [address, setAddress] = useState("");
  const [hostList, setHostList] = React.useState([]);
  useEffect(() => {
    if (route.params) {
      setRadius(route.params.radius);
      setAddress(route.params.address);
    }
  }, [route.params]);
  const handleSearchPress = async () => {
    try {
      const response = await axios.get("http://192.168.1.3:9090/guest/hosts/itemSearch", {
        headers: {
          // Authorization: `Bearer ${jwtToken}`,
          UUID: 'guest#2001',
        }, params: {
          item: searchText,
          radius: radius,
          address: 'address',
        },
      });
      setHostList(response.data);
      // Handle the response data as needed
      // For example, you might set it in state, or navigate to a new screen with the data
    } catch (error) {
      console.error(error);
    }
  };

  const handleFilterPress = () => {
    navigation.navigate("SearchFilterGuest", { radius, address });
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TouchableOpacity onPress={handleFilterPress}>
          <Text style={styles.filterText}>Filter</Text>
        </TouchableOpacity>
        <TextInput
          style={styles.searchInput}
          placeholder="Search your favourite Item"
          value={searchText}
          onChangeText={setSearchText}
        />
        <Button title="Search" onPress={handleSearchPress} />
      </View>
      {hostList.map((host, index) => (
        <HostCard
          key={index}
          host={host.hostEntity}
          itemNames={host.itemNames}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
  },
  searchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
  },
  filterText: {
    fontSize: 16,
    color: "#007AFF",
  },
  searchInput: {
    width: "60%",
    height: 40,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
    paddingHorizontal: 10,
  },
});
