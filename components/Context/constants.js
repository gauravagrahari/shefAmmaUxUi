// config.js
import { URL } from '@env';

const config = {
  URL: URL || 'defaultURL', // Provide a default value if URL is not defined
  // ... other config settings ...
};
console.log("  url  "+URL);

export default config;
