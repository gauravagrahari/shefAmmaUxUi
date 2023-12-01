// config.js
import { URL } from '@env';

const config = {
  URL: 'http://192.168.38.128:9090', // Provide a default value if URL is not defined
  // URL: URL || 'http://192.168.54.128:9090', // Provide a default value if URL is not defined
  // ... other config settings ...
};
console.log("  url  "+URL);

export default config;
