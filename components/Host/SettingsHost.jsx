// SettingsHost.js
import React, { useState } from 'react';
import { StyleSheet, View, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ChangePassword from '../commonMethods/ChangePassword';
import { deleteInSecureStore } from '../Context/SensitiveDataStorage';

export default function SettingsHost() {
  const navigation = useNavigation();
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [isChangePasswordVisible, setIsChangePasswordVisible] = useState(false);

  const handlePasswordChangeSuccess = () => {
    setIsChangePasswordVisible(false);
  };
  const handleLogout = async () => {
    // Here you can call the API to invalidate the token on the server-side
    // After that, remove the JWT from secure storage and navigate to login screen
    await deleteInSecureStore('token');
    navigation.navigate('LoginHost');
  }
  return (
    <View style={styles.container}>
      <ChangePassword 
        visible={isChangePasswordVisible} 
        onClose={() => setIsChangePasswordVisible(false)}
        onPasswordChangeSuccess={handlePasswordChangeSuccess} 
      />
      {!isChangePasswordVisible && 
        <Button 
          title="Change Password" 
          onPress={() => setIsChangePasswordVisible(true)} 
        />
      }
      <Button style={styles.button} title="Logout" onPress={handleLogout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  button:{
    border:20,
  }
});


