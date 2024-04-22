import React from 'react';
import { View, Text, TouchableOpacity, Linking, StyleSheet,Dimensions,ScrollView } from 'react-native';
import {globalStyles,colors} from '../commonMethods/globalStyles';


const scaleFontSize = (size) => {
    const screenWidth = Dimensions.get('window').width;
    const scaleFactor = screenWidth / 320; // Base scale on standard screen width
    return Math.round(size * scaleFactor);
  };
  
  const ReviewPage = () => {
    const formLinks = {
      appReview: 'https://forms.gle/By4iyBPuHaxMm31cA',
      mealReviewNoOrder: 'https://forms.gle/7BdUgQ4f3jrAc8CH7',
      mealReviewOrdered: 'https://forms.gle/3ofjKK2L6SPnVNke8',
      tiffinServiceReview: 'https://forms.gle/yuMuLN26TJ4qv4nD9',
    };
  
    const descriptions = {
      appReview: 'Share your thoughts on our app’s usability and features.',
      mealReviewNoOrder: 'Even if you haven’t ordered yet, let us know what you think about our meal offerings.',
      mealReviewOrdered: 'Tried our meals? We’d love to hear about your food experience.',
      tiffinServiceReview: 'Using our tiffin service? Tell us how we’re doing.',
    };
  
    const openLink = (url) => {
      Linking.openURL(url).catch((err) => console.error('Failed to open URL:', err));
    };
  
    const renderLink = (key) => (
      <View key={key} style={styles.card}>
        <Text style={styles.info}>{descriptions[key]}</Text>
        <TouchableOpacity style={styles.button} onPress={() => openLink(formLinks[key])}>
          <Text style={styles.buttonText}>Give Feedback</Text>
        </TouchableOpacity>
      </View>
    );
  
    return (
      <View style={styles.parent}>
        <ScrollView contentContainerStyle={styles.container} style={{ flexGrow: 1 }}>
          <Text style={styles.title}>We Value Your Feedback!</Text>
          {Object.keys(formLinks).map(renderLink)}
          <View style={styles.card}>
          <Text style={styles.info}>
            Enjoying our app? Take a moment to review us on the Google Play Store!
          </Text>
          <TouchableOpacity style={styles.button} onPress={() => openLink(playStoreUrl)}>
            <Text style={styles.buttonText}>Review Us on Play Store</Text>
          </TouchableOpacity>
        </View>
        </ScrollView>
      </View>
    );
  };
  
  const styles = StyleSheet.create({
    parent: {
      flex: 1,
      backgroundColor: colors.darkBlue,
      alignItems: 'center',
    },
    container: {
      padding: 20,
      backgroundColor: "whitesmoke",
    },
    title: {
      fontSize: scaleFontSize(18),
      fontWeight: 'bold',
      margin: 13,
      marginBottom:25,
      textAlign: 'center',
      color: colors.pink,
    },
    card: {
      borderRadius: 8,
      padding: 20,
      marginBottom: 20,
      borderColor: colors.pink,
      borderWidth: 1,
    //   shadowColor: '#000',
    //   shadowOffset: { width: 0, height: 1 },
    //   shadowOpacity: 0.1,
    //   shadowRadius: 1.5,
    //   elevation: 1,
      backgroundColor: 'rgba(255, 255, 255, 0.3)', // Light transparency for card background
    },
    info: {
      fontSize: scaleFontSize(14),
      marginBottom: 10,
      color: colors.lightishPink,
      textAlign: 'center',
    },
    button: {
      backgroundColor: colors.seaBlue,
      padding: 10,
      borderRadius: 5,
      alignItems: 'center',
    },
    buttonText: {
      color: '#fff',
      fontSize: scaleFontSize(15),
    },
  });
  
  export default ReviewPage;