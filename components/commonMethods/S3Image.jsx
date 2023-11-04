import React, { useState, useEffect } from 'react';
import { Image, View, StyleSheet, Text } from 'react-native';
import { Storage } from '@aws-amplify/storage';
//there's some issue, images uploaded directly from s3 console are retrieved and displayed correctly but 
// the ones uploaded from application are not working
const S3Image = () => {
    const [imageUrl, setImageUrl] = useState(null);

    useEffect(() => {
        const fetchImage = async () => {
            try {
                const signedUrl = await Storage.get("images/ShefAmma (1).jpg");
                setImageUrl(signedUrl);
                console.log(signedUrl);
            } catch (error) {
                console.error('Error fetching image from S3', error);
            }
        };
        fetchImage();
    }, []);

    if (!imageUrl) {
        // You can replace this with a placeholder image or loading spinner
        return null; 
    }

    return (
        <View style={styles.container}>
            <Text>image is below</Text>
            <Image source={{ uri: imageUrl }} style={styles.image} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: 200,
        height: 200,
    },
});

export default S3Image;
