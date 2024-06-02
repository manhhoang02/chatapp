import storage from '@react-native-firebase/storage';
import {DocumentPickerResponse} from 'react-native-document-picker';

export interface FileType {
  uri: string;
  name?: string;
}

export const uploadToCloudStorage = async (file: FileType) => {
  const {uri, name} = file;
  const fileName = name || uri.substring(uri.lastIndexOf('/') + 1);
  const filePath = `media/${fileName}`; // Add the folder path

  // Create a reference to the file in Firebase Storage
  const storageRef = storage().ref(filePath);

  // Upload the file
  const task = storageRef.putFile(uri);

  // Monitor the upload status
  task.on('state_changed', snapshot => {
    console.log(
      'Uploading:',
      snapshot.bytesTransferred,
      '/',
      snapshot.totalBytes,
    );
  });

  await task;

  // Get the download URL
  const downloadURL = await storageRef.getDownloadURL();
  return {uri: downloadURL, name: fileName};
};

export const getImageByPath = async (
  file: DocumentPickerResponse,
): Promise<string> => {
  try {
    // Extract the filename from the given path
    const fileName = file.uri.substring(file.uri.lastIndexOf('/') + 1);

    let type = '';
    switch (file.type) {
      case 'image/jpeg':
        type = 'jpg';
        break;
      case 'image/png':
        type = 'png';
        break;
      case 'video/mp4':
        type = 'mp4';
        break;
    }

    // Construct the full path in Firebase Storage
    const filePath = `media/${fileName}.${type}`;

    // Create a reference to the file in Firebase Storage
    const storageRef = storage().ref(filePath);

    // Get the download URL
    const downloadURL = storageRef.getDownloadURL();

    return downloadURL;
  } catch (error: any) {
    throw new Error(`Failed to get image: ${error.message}`);
  }
};
