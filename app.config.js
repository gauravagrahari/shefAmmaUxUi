import 'dotenv/config';
import { withAndroidManifest } from '@expo/config-plugins';

export default ({ config }) => {
  config = withAndroidManifest(config, async (config) => {
    const manifest = config.modResults.manifest;
    manifest.application[0].$['android:usesCleartextTraffic'] = 'true';
    return config;
  });

  // Define the API URL based on the environment
  const apiUrl = process.env.NODE_ENV === 'production' 
    ? process.env.EXPO_PUBLIC_API_URL_Prod 
    : process.env.EXPO_PUBLIC_API_URL;

  // Ensure config.plugins is an array, initializing if necessary
  const plugins = config.plugins || [];

  return {
    ...config,
    extra: {
      ...config.extra,
      apiUrl: apiUrl, // Set the API URL based on environment
      eas: {
        projectId: "8e888a03-2a05-4bfb-ba7e-993053c2d58c",
        facebookAppId: "3667731043475529"
      }
    },
    plugins: [
      ...plugins,
      [
        "react-native-fbsdk-next",
        {
          "appID": "3667731043475529",
          "clientToken": "d4d805112c9642d03dd188a5b3d8d485",
          "displayName": "Addsdk_Shefamma",
          "scheme": "fb3667731043475529",
          "autoLogAppEventsEnabled": true,
          "isAutoInitEnabled": true,
          "iosUserTrackingPermission": "This identifier will be used to deliver personalized ads to you."
        }
      ],
      "expo-tracking-transparency"
    ]
  };
};
