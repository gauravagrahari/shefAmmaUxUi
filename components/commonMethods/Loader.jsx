import React, { useRef, useEffect } from 'react';
import { View, Animated, Easing, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {globalStyles,colors} from '../commonMethods/globalStyles';

const Loader = () => {
    const rotation = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
            Animated.timing(rotation, {
                toValue: 1,
                duration: 8000,
                easing: Easing.linear,
                useNativeDriver: true,
            })
        ).start();
    }, []);

    const rotationInterpolated = rotation.interpolate({
        inputRange: [0, 0.25, 0.5, 0.75, 1],
        outputRange: ['0deg', '90deg', '180deg', '270deg', '360deg'],
    });

    return (
        <View style={styles.container}>
            <Animated.View 
                style={[ 
                    styles.iconContainer, 
                    {
                        transform: [
                            { translateX: rotation.interpolate({inputRange: [0, 0.25, 0.5, 0.75, 1], outputRange: [-50, 50, 50, -50, -50]}) },
                            { translateY: rotation.interpolate({inputRange: [0, 0.25, 0.5, 0.75, 1], outputRange: [-50, -50, 50, 50, -50]}) }
                        ],
                    }
                ]}
            >
                <Ionicons name="fast-food" size={50} color={colors.pink} />
            </Animated.View>
            
            <Animated.View 
                style={[ 
                    styles.iconContainer, 
                    { 
                        transform: [
                            { translateX: rotation.interpolate({inputRange: [0, 0.25, 0.5, 0.75, 1], outputRange: [50, 50, -50, -50, 50]}) },
                            { translateY: rotation.interpolate({inputRange: [0, 0.25, 0.5, 0.75, 1], outputRange: [-50, 50, 50, -50, -50]}) }
                        ],
                    }
                ]}
            >
                <Ionicons name="heart-circle" size={50} color={colors.darkBlue}/>
            </Animated.View>
            
            <Animated.View 
                style={[ 
                    styles.iconContainer, 
                    { 
                        transform: [
                            { translateX: rotation.interpolate({inputRange: [0, 0.25, 0.5, 0.75, 1], outputRange: [-50, -50, 50, 50, -50]}) },
                            { translateY: rotation.interpolate({inputRange: [0, 0.25, 0.5, 0.75, 1], outputRange: [50, -50, -50, 50, 50]}) }
                        ],
                    }
                ]}
            >
                <Ionicons name="bicycle" size={50} color={colors.darkBlue}/>
            </Animated.View>
            
            <Animated.View 
                style={[ 
                    styles.iconContainer, 
                    { 
                        transform: [
                            { translateX: rotation.interpolate({inputRange: [0, 0.25, 0.5, 0.75, 1], outputRange: [50, -50, -50, 50, 50]}) },
                            { translateY: rotation.interpolate({inputRange: [0, 0.25, 0.5, 0.75, 1], outputRange: [50, 50, -50, -50, 50]}) }
                        ],
                    }
                ]}
            >
                <Ionicons name="time" size={50} color={colors.pink} />
            </Animated.View>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#0A0A0A',
    },
    iconContainer: {
        position: 'absolute',
    },
});

export default Loader;
