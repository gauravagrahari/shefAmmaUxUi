import React from 'react';
import { ScrollView,View, Text, TouchableOpacity, Dimensions, StyleSheet, Linking } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome';
import { globalStyles, colors } from '../commonMethods/globalStyles';

const screenWidth = Dimensions.get('window').width;

const CompanyInfoPage = () => {
  const socialMedia = [
    { icon: 'globe', text: 'Visit Our Website', url: 'https://www.shefamma.com' },
    { icon: 'facebook', text: 'Follow us on Facebook', url: 'https://www.facebook.com/profile.php?id=61557493865956' },
    { icon: 'instagram', text: 'Follow us on Instagram', url: 'https://www.instagram.com/shefamma/' },
    { icon: 'linkedin', text: 'Connect on LinkedIn', url: 'https://www.linkedin.com/company/96166104' },
  ];

  const openLink = (url) => {
    Linking.openURL(url).catch((err) => console.error('An error occurred', err));
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={globalStyles.headerText}>Connect with Us</Text>
      {socialMedia.map((media, index) => (
        <LinearGradient key={index} colors={[colors.darkBlue, colors.secondCardColor]} style={styles.card}>
          <TouchableOpacity onPress={() => openLink(media.url)} style={styles.touchable}>
            <Icon name={media.icon} size={25} color={colors.darkSeaBlue} style={styles.icon} />
            <Text style={styles.contentText}>{media.text}</Text>
          </TouchableOpacity>
        </LinearGradient>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center', // Center content vertically
    padding: screenWidth * 0.05,
    backgroundColor: colors.darkBlue,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: screenWidth * 0.043,
    borderWidth: 1,
    borderColor: colors.deepBlue,
    borderRadius:10,
    // elevation: 6,
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 3 },
    // shadowOpacity: 0.3,
    // shadowRadius: 4,
    marginBottom: screenWidth * 0.06,
    margin: 10,
  },
  touchable: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginRight: 10,
  },
  contentText: {
    fontSize: screenWidth * 0.04,
    color: colors.deepBlue,
    marginLeft: 10,
  },
});

export default CompanyInfoPage;
