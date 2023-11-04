import { Amplify } from 'aws-amplify';
import {Storage} from '@aws-amplify/storage' 
import awsmobile from '../../src/aws-exports.js';

Amplify.configure(awsmobile)
  export const uploadImageToS3 = async (uri, folder = 'images') => {
    const response = await fetch(uri)
    const blob = await response.blob() // format the data for images 
    const randomChars = Math.random().toString(36).substring(2, 5); // Generate a random alphanumeric string of 3 characters
    const timestamp = Date.now().toString(); // Get the current timestamp in milliseconds as a string
    const fileName = timestamp.slice(-10) + `_${randomChars}.jpeg`; // Generate the file name by appending the random alphanumeric value
    return Storage.put(`${folder}/${fileName}`, blob, {
        contentType: 'image/jpeg',
        level: 'public'
    })
}  

export const fetchImages = async (path = 'images/', access = { level: "public" }) => {
    const res = await Storage.list(path, access)
    const resModified = res.slice(1)
    resModified.sort((a, b) => b['lastModified'].toString().localeCompare(a['lastModified']))
    return getImagesUri(resModified)
}

export const getFileFromS3 = async (key) => {
    try {
      const response = await Storage.get(key);
      return response.Body; // Return the file content (Blob)
    } catch (error) {
      console.error('Error retrieving file:', error);
      return null;
    }
  };


export const removeFile = async (name) => {
    try {
        await Storage.remove(name, { level: 'public' });
        console.log(`File ${name} has been removed successfully.`);
    } catch (error) {
        console.error(`Error while removing file ${name}: `, error);
    }
}
// export const uploadImageToS3 = async (uri, mime = 'image/jpeg', folder = 'images') => {
//     try {
//       console.log('URI:', uri); // Add this line
//       const response = await fetch(uri);
//       const blob = await response.blob(); // format the data for images 
//       console.log('Blob:', blob); // Add this line
//       const randomChars = Math.random().toString(36).substring(2, 5); // Generate a random alphanumeric string of 3 characters
//       const timestamp = Date.now().toString(); // Get the current timestamp in milliseconds as a string
//       const fileExtension = mime.split('/')[1];
//       const fileName = `${timestamp.slice(-10)}_${randomChars}.${fileExtension}`; // Generate the file name by appending the random alphanumeric value
//       return Storage.put(`${folder}/${fileName}`, blob, {
//         contentType: mime,
//         level: 'public'
//       });
//     } catch (error) {
//       console.error('Error uploading image to S3:', error);
//     }
//   }
