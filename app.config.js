// App.config.js
import 'dotenv/config';

export default ({ config }) => {
    // Use different environment variables based on the node environment
    const apiUrl = process.env.NODE_ENV === 'production' 
        ? process.env.EXPO_PUBLIC_API_URL_Prod 
        : process.env.EXPO_PUBLIC_API_URL;

    return {
      ...config,
      extra: {
        ...config.extra,
        apiUrl: apiUrl,
      }
    };
};

  