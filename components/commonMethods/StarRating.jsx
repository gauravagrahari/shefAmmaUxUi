import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {globalStyles,colors} from './globalStyles';
import * as Animatable from 'react-native-animatable';


const StarRating = ({ rating }) => {
  const parsedRating = parseFloat(rating);
  const fullStars = Math.floor(parsedRating);
  const remainingRating = parsedRating - fullStars;

  const getStarType = () => {
    if (remainingRating >= 0.75) {
      return 'full';
    } else if (remainingRating >= 0.25) {
      return 'half';
    } else {
      return 'empty';
    }
  };

  const starType = fullStars > 0 ? 'full' : getStarType();

  return (
    <View style={styles.container}>
      <Text style={styles.ratingText}>
        {parsedRating.toFixed(2)}
      </Text>
      <Animatable.Text
          easing="ease-in-out-back"
          iterationDelay={1500}
                animation="rotate"
                useNativeDriver 
                iterationCount='infinite'
                >
      <Icon name={starType === 'full' ? 'star' : starType === 'half' ? 'star-half-full' : 'star-o'} size={20} color={colors.primaryText} />
                </Animatable.Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  ratingText: {
    marginRight: 5, // Adjusted marginLeft to marginRight
    fontSize: 16,
    fontWeight: 'bold',
    color: 'purple',
  },
});

export default StarRating;

// import React from 'react';
// import { View, Text, StyleSheet } from 'react-native';
// import Icon from 'react-native-vector-icons/FontAwesome';

// const StarRating = ({ rating }) => {
//   const parsedRating = parseFloat(rating);
//   const fullStars = Math.floor(parsedRating);
//   const remainingRating = parsedRating - fullStars;

//   const getStarType = (index) => {
//     if (index < fullStars) {
//       return 'full';
//     } else if (index === fullStars) {
//       if (remainingRating >= 0.75) {
//         return 'full';
//       } else if (remainingRating >= 0.25) {
//         return 'half';
//       } else {
//         return 'empty';
//       }
//     } else {
//       return 'empty';
//     }
//   };

//   const renderStar = (index) => {
//     const starType = getStarType(index);
//     return (
//       <Icon key={index} name={starType === 'full' ? 'star' : starType === 'half' ? 'star-half-full' : 'star-o'} size={20} color="#FFD700" />
//     );
//   };

//   return (
//     <View style={styles.container}>
//       {Array.from({ length: 5 }).map((_, index) => renderStar(index))}
//       <Text style={styles.ratingText}>
//         {parsedRating.toFixed(2)}
//       </Text>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 5,
//   },
//   ratingText: {
//     marginLeft: 5,
//     fontSize: 14,
//     fontWeight: 'bold',
//     color: '#2C3E50',
//   },
// });

// export default StarRating;
