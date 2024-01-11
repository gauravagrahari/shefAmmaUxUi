import 'dotenv/config';

export default ({ config }) => {
  return {
    ...config,
    extra: {
      apiUrl: process.env.API_URL || "http://uat-env.eba-epp52dpv.ap-south-1.elasticbeanstalk.com"
    },
  };
};
