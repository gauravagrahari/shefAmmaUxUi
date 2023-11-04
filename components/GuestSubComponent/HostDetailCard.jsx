import { StyleSheet, Text, View, Image, TouchableOpacity, Dimensions } from 'react-native';
import React, { useState } from 'react';


export default function HostDetailCard({ hostDetails }) {
  const { host, hostAccount } = hostDetails;
  const [isDPFullScreen, setIsDPFullScreen] = useState(false);
  const [isDDPFullScreen, setIsDDPFullScreen] = useState(false);

  const toggleDPFullScreen = () => {
    setIsDPFullScreen(!isDPFullScreen);
  };

  const toggleDDPFullScreen = () => {
    setIsDDPFullScreen(!isDDPFullScreen);
  };

  const handleTapOutsideImage = () => {
    setIsDPFullScreen(false);
    setIsDDPFullScreen(false);
  };

  const renderImage = (source, isFullScreen, onPress) => {
    if (isFullScreen) {
      return (
        <TouchableOpacity style={styles.fullScreenImageContainer} onPress={onPress}>
          <Image style={styles.fullScreenImage} resizeMode="contain" source={source} />
        </TouchableOpacity>
      );
    } else {
      return (
        <TouchableOpacity style={styles.imageContainer} onPress={onPress}>
          <Image style={styles.image} resizeMode="cover" source={source} />
        </TouchableOpacity>
      );
    }
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handleTapOutsideImage}>
      {renderImage({ uri: host.DP }, isDPFullScreen, toggleDPFullScreen)}
      <Text style={styles.name}>{host.name}</Text>
      <Text style={styles.hostPhone}>{hostAccount.hostPhone}</Text>
      <Text style={styles.rating}>{host.rating} *</Text>
      <Text style={styles.address}>{host.address}</Text>
      <Text style={styles.dineCategory}>{host.dineCategory}</Text>
      <Text style={styles.nameItem}>{host.nameItem}</Text>
      <Text style={styles.descriptionHost}>{host.descriptionHost}</Text>
      {renderImage({ uri: host.DDP }, isDDPFullScreen, toggleDDPFullScreen)}
    </TouchableOpacity>
  );
}

const windowWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  imageContainer: {
    height: windowWidth / 2, // Half of the screen height
    width: windowWidth,
  },
  image: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  fullScreenImageContainer: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreenImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  hostPhone: {
    marginTop: 5,
  },
  rating: {
    marginTop: 5,
  },
  address: {
    marginTop: 5,
  },
  nameItem: {
    marginTop: 5,
  },
  descriptionHost: {
    marginTop: 5,
  },
});
