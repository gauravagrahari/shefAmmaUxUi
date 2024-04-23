import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import { colors } from '../commonMethods/globalStyles';

const screenWidth = Dimensions.get('window').width;

const TextCarousel = ({ texts }) => {
    const [activeSlide, setActiveSlide] = React.useState(0);

    const renderItem = ({ item }) => {
        return (
            <View style={styles.slide}>
                <Text style={styles.text}>{item}</Text>
            </View>
        );
    };

    if (!texts || texts.length === 0) {
        return (
            <View style={styles.slide}>
                <Text style={styles.text}>No data available</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Carousel
                data={texts}
                renderItem={renderItem}
                sliderWidth={screenWidth}
                itemWidth={screenWidth}
                onSnapToItem={(index) => setActiveSlide(index)}
                loop={true}
                autoplay={true}
                autoplayInterval={4000}
            />
            <Pagination
                dotsLength={texts.length}
                activeDotIndex={activeSlide}
                containerStyle={styles.paginationContainer}
                dotStyle={styles.dotStyle}
                inactiveDotStyle={styles.inactiveDotStyle}
                inactiveDotOpacity={0.4}
                inactiveDotScale={0.6}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container:{
// backgroundColor:'smokewhite',
// borderRadius:10,        
    },
    slide: {
        width: screenWidth*0.95,
        height: 100, // Fixed height for all slides
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 19, // Increased font size for better readability
        fontWeight: 'bold', // Made text bold
        // color: '#860000',
        color: colors.green,
        textAlign: 'center',
        fontStyle: 'italic', // Italicize for emphasis
        paddingHorizontal: 10, // Added padding for better text alignment and spacing
        lineHeight: 25, // Adjusted line height for better text appearance
    },
    paginationContainer: {
        paddingTop: 0, // Reduced padding to minimize space between text and dots
    },
    dotStyle: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginHorizontal: 8,
        backgroundColor: colors.lightPink,
    },
    inactiveDotStyle: {
        backgroundColor: 'gray',
    },
});

export default TextCarousel;
