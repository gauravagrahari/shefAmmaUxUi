import { SafeAreaView, Text, View, Button, Platform, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignupGuest from "./components/Guest/SignupGuest";
import HostProfileMealGuest from "./components/Guest/HostProfileMealGuest";
import HomeGuest from "./components/Guest/HomeGuest";
import SettingsGuest from "./components/Guest/SettingsGuest";
import OrderHistoryGuest from "./components/Guest/OrderHistoryGuest";
import DetailsGuest from "./components/Guest/DetailsGuest";
// import TestImage from "./components/commonMethods/TestImage";
// import AddItemHost from "./components/Host/AddItemHost";
// import SignupHost from "./components/Host/SignupHost";
// import HostAddDetailsFormTest from "./components/Host/HostAddDetailsFormTest";
// import DetailsHost from "./components/Host/DetailsHost";
// import AddTimeSlot from "./components/Host/AddTimeSlot";
// import ItemCardTest from "./components/test/ItemCardTest";
// import TestProfileHost from "./components/test/TestProfileHost";
// import SlotCardTest from "./components/test/SlotCardTest";
// import TestEditableText from "./components/test/TestEditableText";
import NavBarGuest from "./components/GuestSubComponent/NavBarGuest";
// import NavBarHost from "./components/HostSubComponent/NavBarHost";
import React, { useEffect, useState, useRef } from 'react';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';

import LoginHost from "./components/Host/LoginHost";
import LoginGuest from "./components/Guest/LoginGuest";
// import NavHost from "./components/HostSubComponent/NavHost";
import UpdateGuestDetails from "./components/Guest/UpdateGuestDetails";
import S3Image from "./components/commonMethods/S3Image";
// import ProfileHost from "./components/Host/ProfileHost";
// import EditTimeSlot from "./components/Host/EditTimeSlot";
// import EditItemHost from "./components/Host/EditItemHost";
// import EditDetailsHost from "./components/Host/EditDetailsHost";
import LoginDevBoy from "./components/DevBoy/LoginDevBoy";
import SettingsDevBoy from "./components/DevBoy/SettingsDevBoy";
import HomeDevBoy from "./components/DevBoy/HomeDevBoy";
import OrderHistoryDevBoy from "./components/DevBoy/OrderHistoryDevBoy";
import { getFromSecureStore } from "./components/Context/SensitiveDataStorage";
import { LinearGradient } from 'expo-linear-gradient';
import { HostProvider } from "./components/Context/HostContext";
import { init } from "./components/Context/sqLiteDB";
import ItemListGuest from "./components/Guest/ItemListGuest";   
import ForgotPassword from "./components/Guest/ForgotPassword";   
import ChargesDisplay from "./components/Guest/ChargesDisplay";   
import { AddressProvider } from "./components/Context/AddressContext";
import LoadingScreen from "./components/commonMethods/LoadingScreen";
import ContactPage from "./components/Guest/ContactPage";
import SelectDefaultAddress from "./components/Guest/SelectDefaultAddress";
import WelcomeMessage from "./components/Guest/WelcomeMessage";
import AboutUs from "./components/Guest/AboutUs";
import CancellationPolicy from "./components/Guest/CancellationPolicy";
import ServiceAvailability from "./components/Guest/ServiceAvailability";
import ReviewPage from "./components/Guest/ReviewPage";
import CompanyInfoPage from "./components/Guest/CompanyInfoPage";
import { OrdersProvider } from "./components/Context/OrdersContext";
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import Dashboard from "./components/Host/Dashboard";
import SettingsHost from "./components/Host/SettingsHost";
import HostCancellationPolicy from "./components/Host/HostCancellationPolicy";
import LandingScreen from "./components/Guest/LandingScreen";
import { useNavigation } from '@react-navigation/native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});


const Stack = createNativeStackNavigator();
export default function App() {
  const [initialRoute, setInitialRoute] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hostList, setHostList] = React.useState([]);
  const [hasFetchedHosts, setHasFetchedHosts] = React.useState(false);
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState();
  const notificationListener = useRef();
  const responseListener = useRef();
  const navigationRef = useRef();

  useEffect(() => {
    init()
      .then(() => console.log('Database initialized'))
      .catch((err) => console.error('Database initialization failed:', err));
  },[]);

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));
    
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
      navigationRef.current?.navigate('HomeGuest');  // Ensure navigation ref is current and navigate
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);


  async function registerForPushNotificationsAsync() {
    let token;
    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log(token);
    } else {
      alert('Must use physical device for push notifications');
    }

    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    return token;
  }
  useEffect(() => {
    const checkCredentials = async () => {
      const token = await getFromSecureStore('token');
      const uuidGuest = await getFromSecureStore('uuidGuest');
      const uuidDevBoy = await getFromSecureStore('uuidDevBoy');
      const uuidHost = await getFromSecureStore('uuidHost'); // New line: checking for host UUID
      const timeStamp = await getFromSecureStore('timeStamp');

      if (token !== null && uuidGuest !== null && timeStamp !== null) {
        setInitialRoute('SelectDefaultAddress');
      } else if (token !== null && uuidDevBoy !== null && timeStamp !== null) {
        setInitialRoute('HomeDevBoy');
      } else if (token !== null && uuidHost !== null && timeStamp !== null) { // New condition for host
        setInitialRoute('SettingsHost');
      } else {
        setInitialRoute('LandingScreen');
      }
      setIsLoading(false);
    };

    checkCredentials();
  }, []);
  useEffect(() => {
    const hideSplashScreen = async () => {
      await new Promise(resolve => setTimeout(resolve, 1500)); // Wait for 1.5 seconds
      await SplashScreen.hideAsync(); // Hide the splash screen
    };

    hideSplashScreen();
  }, []);
  if (isLoading) {
    return <LoadingScreen />;
}
  return (
    <SafeAreaView style={{ flex: 1, paddingTop: 33 }}>
    {/* <SafeAreaView style={{ flex: 1}}> */}
            <StatusBar style="dark" backgroundColor="#ffffff" />
    <HostProvider>
         <AddressProvider>
         <OrdersProvider>
         <NavigationContainer ref={navigationRef}>
    <Stack.Navigator 
            initialRouteName={initialRoute}
            screenOptions={{ header: () => null }}>
        <Stack.Screen name="HomeGuest" component={HomeGuest}/> 
        <Stack.Screen name="LoadingScreen" component={LoadingScreen}/> 
        <Stack.Screen name="WelcomeMessage" component={WelcomeMessage}/> 
        <Stack.Screen name="ChargesDisplay" component={ChargesDisplay}/>
        <Stack.Screen name="SelectDefaultAddress" component={SelectDefaultAddress}/>
        <Stack.Screen name="ContactPage" component={ContactPage}/>
        <Stack.Screen name="ForgotPassword" component={ForgotPassword}/>
        <Stack.Screen name="OrderHistoryGuest" component={OrderHistoryGuest}/>
        <Stack.Screen name="DetailsGuest" component={DetailsGuest}/>
        <Stack.Screen name="UpdateGuestDetails" component={UpdateGuestDetails}/>
        <Stack.Screen name="SettingsGuest" component={SettingsGuest}/>
        <Stack.Screen name="HostProfileMealGuest" component={HostProfileMealGuest}/>
        {/* <Stack.Screen name="HostProfileGuest" component={HostProfileGuest}/>
        <Stack.Screen name="AddItemHost" component={AddItemHost}/>
        <Stack.Screen name="ItemCardTest" component={ItemCardTest}/> */}
        <Stack.Screen name="SignupGuest" component={SignupGuest}/>
        <Stack.Screen name="LoginHost" component={LoginHost}/>
        <Stack.Screen name="LoginGuest" component={LoginGuest}/>
        <Stack.Screen name="LoginDevBoy" component={LoginDevBoy}/>
        <Stack.Screen name="SettingsDevBoy" component={SettingsDevBoy}/>
        <Stack.Screen name="HomeDevBoy" component={HomeDevBoy}/>
        <Stack.Screen name="OrderHistoryDevBoy" component={OrderHistoryDevBoy}/>
        {/* <Stack.Screen name="DetailsHost" component={DetailsHost}/>
        <Stack.Screen name="TestImage" component={TestImage}/>
        <Stack.Screen name="HostAddDetailsFormTest" component={HostAddDetailsFormTest}/>
        <Stack.Screen name="AddTimeSlot" component={AddTimeSlot}/>
        <Stack.Screen name="SlotCardTest" component={SlotCardTest}/> */}
        <Stack.Screen name="NavBarGuest" component={NavBarGuest}/>
        <Stack.Screen name="Dashboard" component={Dashboard}/>
        <Stack.Screen name="SettingsHost" component={SettingsHost}/>
        <Stack.Screen name="HostCancellationPolicy" component={HostCancellationPolicy}/>
        {/* <Stack.Screen name="ProfileHost" component={ProfileHost}/> */}
        {/* <Stack.Screen name="ProfileGuest" component={ProfileGuest}/> */}
        {/* <Stack.Screen name="S3Image" component={S3Image}/> */}
        {/* <Stack.Screen name="TestProfileHost" component={TestProfileHost}/> */}
        {/* <Stack.Screen name="TestEditableText" component={TestEditableText}/>
        <Stack.Screen name="EditTimeSlot" component={EditTimeSlot}/>
        <Stack.Screen name="EditDetailsHost" component={EditDetailsHost}/>*/}
        <Stack.Screen name="ItemListGuest" component={ItemListGuest} />
        <Stack.Screen name="AboutUs" component={AboutUs} />
        <Stack.Screen name="CancellationPolicy" component={CancellationPolicy} />
        <Stack.Screen name="ServiceAvailability" component={ServiceAvailability} /> 
        <Stack.Screen name="ReviewPage" component={ReviewPage} /> 
        <Stack.Screen name="CompanyInfoPage" component={CompanyInfoPage} /> 
        <Stack.Screen name="LandingScreen" component={LandingScreen} /> 
      </Stack.Navigator>
    </NavigationContainer>
    </OrdersProvider>
    </AddressProvider>
    </HostProvider>
 </SafeAreaView>

  );
}
const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
},
brandContainer: {
    flexDirection: 'row',
    marginBottom: 20,
},
shef: {
    fontSize: 48,
    color: '#D0004E',
},
amma: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#D0004E',
},
tagline: {
    fontSize: 16,
    color: '#C84476',
    fontStyle: 'italic',
},
});
// {"key": "images/8727054607_pkr.jpeg"}
// public/images/plate1.jpg