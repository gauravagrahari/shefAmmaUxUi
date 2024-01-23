import {
  Button,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
  View,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import axios from "axios";
import OtpVerification from "../commonMethods/OtpVerification";
import { useNavigation } from "@react-navigation/native";
import { storeInSecureStore } from "../Context/SensitiveDataStorage";
import config from "../Context/constants";
import { LinearGradient } from "expo-linear-gradient";
import { globalStyles, colors } from "../commonMethods/globalStyles";
import { Ionicons } from "@expo/vector-icons";
import Constants from "expo-constants";
import { AccessibilityStatePropType } from "deprecated-react-native-prop-types/DeprecatedViewAccessibility";
const URL = Constants.expoConfig.extra.apiUrl;

export default function SignupGuest() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phoneVerified, setPhoneVerified] = useState({
    verified: false,
    value: null,
  });
  const [errorMessage, setErrorMessage] = useState(null);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigation = useNavigation();

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisible(!confirmPasswordVisible);
  };
  const handleSignup = () => {
    if (password !== confirmPassword) {
      alert("Password and Confirm Password do not match");
      return;
    }

    if (!phoneVerified.verified) {
      alert("Please verify your phone number");
      return;
    }
    setIsSubmitting(true);
    const data = {
      password: password,
      phone: phoneVerified.value,
      timeStamp: new Date().toISOString(),
    };

    axios
      .post(`${URL}/guestSignup`, data)
      .then((response) => {
        console.log("Server response:", response.data);
        storeInSecureStore("token", response.data.token);

        if (typeof response.data.uuidGuest === "string") {
          storeInSecureStore("uuidGuest", response.data.uuidGuest);
          storeInSecureStore("timeStamp", response.data.timeStamp);
          storeInSecureStore("phone", data.phone);
        } else {
          console.error("uuidGuest is not a string:", response.data.uuidGuest);
        }

        navigation.navigate("DetailsGuest", {
          uuidGuest: response.data.uuidGuest,
        });
      })
      .catch((error) => {
        if (error.response && error.response.data) {
          setErrorMessage(error.response.data);
        } else {
          console.error("Error:", error);
        }
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <LinearGradient
      colors={["white", colors.darkBlue]}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.welcomeText}>
          <Text style={styles.brand}>
            Shef<Text style={styles.boldBrand}>Amma</Text>
          </Text>
        </Text>

        <View style={styles.innerContainer}>
          <OtpVerification type="phone" onVerify={setPhoneVerified} />

          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={24} color="black" />
            <TextInput
              style={styles.input}
              placeholder="Enter Password"
              secureTextEntry={!passwordVisible}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity onPress={togglePasswordVisibility}>
              <Ionicons
                name={passwordVisible ? "eye-off" : "eye"}
                size={24}
                color="black"
              />
            </TouchableOpacity>
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={24} color="black" />
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              secureTextEntry={!confirmPasswordVisible}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            <TouchableOpacity onPress={toggleConfirmPasswordVisibility}>
              <Ionicons
                name={confirmPasswordVisible ? "eye-off" : "eye"}
                size={24}
                color="black"
              />
            </TouchableOpacity>
          </View>

          {errorMessage && (
            <Text style={styles.errorMessage}>{errorMessage}</Text>
          )}

          <TouchableOpacity
            style={[styles.button, isSubmitting && styles.disabledButton]}
            onPress={handleSignup}
            disabled={isSubmitting}
          >
            <Text style={styles.buttonText}>SignUp</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate("LoginGuest")}>
            <Text style={styles.linkText}>
              Already have an account? Login here
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("LoginDevBoy")}>
            <Text style={styles.linkText}>Partner Login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

// Add your styles here

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center", // Aligns children vertically in the center
    paddingHorizontal: 20,
    paddingTop: 20, // Adjust as needed for spacing at the top
  },
  scrollContent: {
    flexGrow: 1, // Ensures the ScrollView content grows to fill the space
    justifyContent: "center", // Center content vertically inside the ScrollView
    alignItems: "center",
    paddingBottom: 30,
  },
  welcomeText: {
    fontSize: 20,
    margin: 20, // Reduced margin
    color: colors.pink,
  },
  brand: {
    fontSize: 26,
  },
  boldBrand: {
    fontWeight: "bold",
  },
  innerContainer: {
    width: "100%",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    borderBottomColor: colors.pink,
    borderBottomWidth: 2,
  },
  input: {
    flex: 1,
    height: 50,
    marginLeft: 10,
    color: "black", // Updated color
    fontSize: 16,
  },
  button: {
    width: "100%",
    height: 55,
    marginTop: 20,
    marginBottom: 20,
    borderRadius: 10,
    borderColor: colors.pink,
    borderWidth: 2,
    backgroundColor: "rgba(0, 150, 136, 0.15)",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: colors.matBlack,
    fontSize: 17,
  },
  disabledButton: {
    width: "100%",
    height: 55,
    marginTop: 20,
    marginBottom: 20,
    borderRadius: 10,
    borderColor: colors.pink,
    borderWidth: 2,
    backgroundColor: "lightgray",
    justifyContent: "center",
    alignItems: "center",
  },
  linkText: {
    marginTop: 15,
    textAlign: "center",
    color: "#3498db",
    fontSize: 17,
    fontWeight: "500",
  },
  errorMessage: {
    color: "red",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 15,
  },
});
