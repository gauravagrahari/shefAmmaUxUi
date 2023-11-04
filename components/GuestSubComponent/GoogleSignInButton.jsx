import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Button, Image } from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import AsyncStorage from "@react-native-async-storage/async-storage";

WebBrowser.maybeCompleteAuthSession();

export default function GoogleSignInButton() {
  const [token, setToken] = useState("");
  const [userInfo, setUserInfo] = useState(null);

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: "257634256765-c38c7sv531oo4jkptu32e9t4a4audjtr.apps.googleusercontent.com",
    iosClientId: "257634256765-l5b4ipm3gdnk8qd7t98fbg8rqgk9gmqn.apps.googleusercontent.com",
    webClientId: "257634256765-i77v0altenu99vllpifeb7bd2sosv4lg.apps.googleusercontent.com",
    expoClientId: "257634256765-i77v0altenu99vllpifeb7bd2sosv4lg.apps.googleusercontent.com",
  });

  useEffect(() => {
    handleEffect();
  }, [response, token]);

  async function handleEffect() {
    const user = await getLocalUser();
    if (!user) {
      if (response?.type === "success") {
        getUserInfo(response.authentication.accessToken);
      }
    } else {
      setUserInfo(user);
    }
  }
  const deleteUserInfo = async () => {
    try {
      await AsyncStorage.removeItem("@user");
      setUserInfo(null); // Reset user info state to null
      console.log("User details deleted successfully.");
    } catch (error) {
      console.log("Error deleting user details:", error);
    }
  };
  
  const getLocalUser = async () => {
    const data = await AsyncStorage.getItem("@user");
    if (!data) return null;
    return JSON.parse(data);
  };

  const getUserInfo = async (token) => {
    if (!token) return;
    try {
      const response = await fetch(
        "https://www.googleapis.com/userinfo/v2/me",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const user = await response.json();
      console.log("Fetched user details:", user);

      await AsyncStorage.setItem("@user", JSON.stringify(user));
      setUserInfo(user);
    } catch (error) {
      // Add your own error handler here
    }
  };

  return (
    <View >
      {!userInfo ? (
        <Button
          title="Sign in with Google"
          disabled={!request}
          onPress={() => {
            promptAsync();
          }}
        />
      ) : (
        <View style={styles.card}>
  {userInfo?.picture && (
    <Image source={{ uri: userInfo?.picture }} style={styles.image} />
  )}
  <Text style={styles.text}>Email: {userInfo.email}</Text>
  <Text style={styles.text}>
    Verified: {userInfo.verified_email ? "yes" : "no"}
  </Text>
  <Text style={styles.text}>Name: {userInfo.name}</Text>
  <Button title="Delete Details" onPress={deleteUserInfo} />
</View>

      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
  },
  card: {
    borderWidth: 1,
    borderRadius: 15,
    padding: 15,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
});
