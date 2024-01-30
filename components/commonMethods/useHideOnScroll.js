import { useState, useRef } from 'react';
import { Animated } from 'react-native';

const useHideOnScroll = (componentHeight, threshold = 20) => {
  const [scrollY] = useState(new Animated.Value(0));
  const lastScrollY = useRef(0);
  const scrollOffset = useRef(new Animated.Value(0)); // For controlling the translateY

  const handleScroll = event => {
    const currentScrollY = event.nativeEvent.contentOffset.y;
    if (currentScrollY > lastScrollY.current && currentScrollY > threshold) {
      // Scrolling down
      Animated.timing(scrollOffset.current, {
        toValue: -componentHeight, // Slide up
        duration: 200,
        useNativeDriver: true,
      }).start();
    } else if (currentScrollY < lastScrollY.current && lastScrollY.current > threshold) {
      // Scrolling up
      Animated.timing(scrollOffset.current, {
        toValue: 0, // Slide down
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
    lastScrollY.current = currentScrollY;
  };

  const animatedStyle = {
    transform: [{ translateY: scrollOffset.current }],
  };

  return { animatedStyle, handleScroll };
};

export default useHideOnScroll;
