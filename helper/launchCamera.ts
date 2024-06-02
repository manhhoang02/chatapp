import ImagePicker from 'react-native-image-crop-picker';

export const launchCamera = async () => {
  try {
    const image = await ImagePicker.openCamera({
      width: 400,
      height: 400,
      cropping: true,
    });
    return image;
  } catch (error) {
    console.log('Error launching camera:', error);
  }
};
