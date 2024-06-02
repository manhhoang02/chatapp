import storage from '@react-native-firebase/storage';
import {MediaType} from 'app/store/homeStore';

export const uploadToCloudStorage = async (file: MediaType) => {
  const {uri, name} = file;
  const fileName = name || uri.substring(uri.lastIndexOf('/') + 1);
  const filePath = `media/${fileName}`; // Add the folder path

  // Create a reference to the file in Firebase Storage
  const storageRef = storage().ref(filePath);

  // Upload the file
  const task = storageRef.putFile(uri);

  await task;

  // Get the download URL
  const downloadURL = await storageRef.getDownloadURL();
  return {uri: downloadURL, name: fileName};
};

export const getImagePath = async (file: MediaType): Promise<string> => {
  // Extract the filename from the given path

  // Construct the full path in Firebase Storage
  const filePath = `media/${file.name}`;

  // Create a reference to the file in Firebase Storage
  const storageRef = storage().ref(filePath);

  // Get the download URL
  const downloadURL = storageRef.getDownloadURL();

  return downloadURL;
};
