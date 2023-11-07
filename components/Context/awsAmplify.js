import Amplify from 'aws-amplify';

Amplify.configure({
  Auth: {
    region: 'ap-south-1',
    userPoolId: 'us-east-1_XXXXX',
    userPoolWebClientId: 'XXXXX',
  },
});
