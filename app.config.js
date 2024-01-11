import 'dotenv/config';

export default ({ config }) => {
    return {
      ...config,
      extra: {
         apiUrl: process.env.API_URL || "http://uat-env.eba-epp52dpv.ap-south-1.elasticbeanstalk.com",
        eas: {
          projectId: "8e888a03-2a05-4bfb-ba7e-993053c2d58c"
        }
      }
    };
  };
  