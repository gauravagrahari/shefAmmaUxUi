import 'dotenv/config';

export default ({ config }) => {
    return {
      ...config,
      extra: {
        ...config.extra, // Keep existing extra properties
        eas: {
          projectId: "8e888a03-2a05-4bfb-ba7e-993053c2d58c"
        }
      }
    };
  };
  