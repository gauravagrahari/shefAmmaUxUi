import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity,ImageBackground  } from 'react-native';
import { globalStyles, colors } from '../commonMethods/globalStyles';
import ChefHatIcon from '../../assets/chefHatIcon52.svg'; // Import your SVG icon
import { LinearGradient } from 'expo-linear-gradient';
import TextCarousel from '../GuestSubComponent/TextCarousel'; 
import LandingImage from '../../assets/AppLandingBg.jpg'; 
const LandingScreen = ({ navigation }) => {
    const introTexts = [
        "Experience the comfort of home-cooked meals delivered to your doorstep.",
        "Enjoy our Lunch, Dinner, and Tiffin Services available in select locations in Kolkata.",
        "Visit ShefAmma.com to explore our Tiffin Service and more.",
        "Connecting you directly with local moms who prepare delicious home-cooked meals",
    ];
    return (
        <ImageBackground source={LandingImage} style={styles.bg}>

        <View style={styles.container}>

            <View style={styles.iconContainer}>
                <ChefHatIcon fill={colors.pink} width={100} height={100} stroke={colors.pink} strokeWidth="0.3" />
            </View>
            <Text style={styles.welcomeText}>
  Welcome to <Text style={styles.brand}>Shef<Text style={styles.boldBrand}>Amma</Text></Text>!
</Text>
            <View style={styles.bordering}>
                
            <TextCarousel texts={introTexts} />
            </View>
            {/* <Text style={styles.locationText}>
                Currently serving select locations in Kolkata.
            </Text> */}
         
            <View>
                <TouchableOpacity onPress={() => navigation.navigate('LoginGuest')}>
                    <Text style={styles.exploreText}>Already have an Account? Login</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('SignupGuest')}>
                    <Text style={styles.exploreText}>New to ShefAmma? Sign Up here</Text>
                </TouchableOpacity>
            </View>
         
   <View style={styles.carousalContainer}>
            </View>

        </View>
        </ImageBackground>

    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    justifyContent: 'center',
    // alignItems: 'center',
    },
    bg: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    iconContainer: {
        alignItems: 'center',
        marginVertical: 30,
        marginBottom:10,
    },
    bordering:{
marginBottom:20,        // borderColor:'whitesmoke',
        // borderRadius:15,
    },
    carousalContainer: {
        width: '100%', // Takes the full width of the container
        alignItems: 'center', // Centers the carousel horizontally within the container
        justifyContent: 'center', // Optional if you want it also centered vertically
    marginVertical: 70,
    },
    welcomeText: {
        fontSize: 24,
        fontWeight: 'bold', // Set normal to avoid all text being bold
        color: colors.pink, // Use a contrast color for better visibility
        textAlign: 'center',
        marginBottom: 50,
        textDecorationLine: 'underline',
      },
      brand: {
        fontSize: 28,

        fontWeight: 'normal', // Normal weight for "Shef"
      },
      boldBrand: {
        fontSize: 28,

        fontWeight: 'bold', // Bold weight for "Amma"
      },
    introText: {
        fontSize: 16,
        color: colors.deepBlue, // Dark sea blue for text for better readability
        marginBottom: 30,
        textAlign: 'center',
    },
    linkContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 20,
    },
    linkButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        backgroundColor: colors.darkSeaBlue, // Use dark sea blue for button backgrounds
    },
    linkText: {
        marginTop: 15,
        textAlign: 'center',
        // color: 'white',
        color: '#3498db',
        fontSize: 17,
        fontWeight: '500',
        borderWidth: 1,
        borderColor:'white',
      },
    exploreText: {
        fontSize: 18,
        color: colors.pink, // Use sea blue for links
        // color: 'white', // Use sea blue for links
        textAlign: 'center',
        margin: 5,
        textDecorationLine: 'underline',
    },
    locationText: {
        fontSize: 18,
        color: colors.pink, // Consistent with other links
        marginVertical: 30,
        textAlign: 'center',
        // fontWeight:'bold',
    },
});

export default LandingScreen;
