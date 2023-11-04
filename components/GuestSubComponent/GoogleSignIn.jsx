import React from 'react';
import { Button, Alert } from 'react-native';
import * as AuthSession from 'expo-auth-session';
import * as Random from 'expo-random';
import { StyleSheet } from 'react-native';

const useProxy = true; // Use AuthSession's proxy service, especially for standalone apps
const googleClientId = '257634256765-c38c7sv531oo4jkptu32e9t4a4audjtr.apps.googleusercontent.com';
// const googleClientId = '257634256765-i77v0altenu99vllpifeb7bd2sosv4lg.apps.googleusercontent.com';

export default function GoogleSignIn() {
  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: googleClientId,
      scopes: ['profile', 'email'],
      redirectUri: useProxy ? AuthSession.makeRedirectUri({ useProxy }) : AuthSession.makeRedirectUri(),
      responseType: 'token',
      usePKCE: false,
    },
    { authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth' }
  );

  const handleLogin = async () => {
    const result = await promptAsync();

    if (result.type === 'success') {
      const userInfoResponse = await fetch('https://www.googleapis.com/userinfo/v2/me', {
        headers: { Authorization: `Bearer ${result.params.access_token}` },
      });

      const userInfo = await userInfoResponse.json();
      Alert.alert('Logged in!', `Hi ${userInfo.name}!`);
      // Here, you can set the userInfo to some state or context to use in your app
    } else {
      Alert.alert('Failed to log in', 'Please try again');
    }
  };

  return <Button title="Sign in with Google" onPress={handleLogin} />;
}
