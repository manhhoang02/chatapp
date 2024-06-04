import ImagePicker, {Options} from 'react-native-image-crop-picker';

export const launchCamera = async (options?: Options) => {
  try {
    const image = await ImagePicker.openCamera(
      options || {
        width: 400,
        height: 400,
        cropping: true,
      },
    );
    return image;
  } catch (error) {
    console.log('Error launching camera:', error);
  }
};
