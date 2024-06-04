import React, {useState} from 'react';
import AppConstant from '@abong.code/config/AppConstant';
import {Alert, TouchableOpacity} from 'react-native';
import {StyleSheet, View} from 'react-native';
import Modal from 'react-native-modal';
import color from '@abong.code/theme/color';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DocumentPicker from 'react-native-document-picker';
import IconAddImage from 'assets/icons/home/IconAddImage';
import {AppText} from '@starlingtech/element';
import {MediaType} from 'app/store/homeStore';
import {getImagePath, uploadToCloudStorage} from 'helper/uploadToCloudStorage';
import {launchCamera} from 'helper/launchCamera';
import {useEditProfile, useGetUserById} from 'app/api/auth';
import useAuthStore from 'app/store/authStore';
import {shallow} from 'zustand/shallow';
import ModalViewSingleMedia from './ModalViewSingleMedia';

const BACKGROUND_HEIGHT = AppConstant.SCREEN_WIDTH * 0.5;
const BACKGROUND_WIDTH = AppConstant.SCREEN_WIDTH;

type Props = {
  mode: 'avatar' | 'background';
  userId: string;
  isVisible: boolean;
  onClose: () => void;
  setImage: (uri: string) => void;
};

export default function (props: Props) {
  const [user, dispatchUser] = useAuthStore(
    s => [s.user, s.dispatchUser],
    shallow,
  );
  const {mutate: editProfile} = useEditProfile();
  const {data} = useGetUserById(props.userId);

  const [showMedia, setShowMedia] = useState(false);

  const handleAlert = (file: MediaType) => {
    const alert = props.mode === 'avatar' ? 'ảnh đại diện' : 'ảnh bìa';
    Alert.alert('Xác nhận', `Bạn có muốn chọn ảnh này làm ${alert}?`, [
      {
        text: 'Hủy',
        style: 'cancel',
        onPress: () => {
          props.setImage('');
        },
      },
      {
        text: 'Đồng ý',
        style: 'destructive',
        onPress: async () => {
          await uploadToCloudStorage(file);
          const newUri = await getImagePath(file);
          if (props.mode === 'avatar') {
            editProfile({userId: user.id, data: {avatar: newUri}});
            dispatchUser({avatar: newUri});
          } else {
            editProfile({userId: user.id, data: {background: newUri}});
            dispatchUser({background: newUri});
          }
        },
      },
    ]);
  };

  const handleSelectFile = async () => {
    props.onClose();
    try {
      const result = await DocumentPicker.pickSingle({
        type: DocumentPicker.types.images,
      });

      if (result) {
        const file = {uri: result.uri, name: result.name || ''};
        props.setImage(file.uri);

        handleAlert(file);
      }
    } catch (error) {
      if (DocumentPicker.isCancel(error)) {
      } else {
        throw error;
      }
    }
  };

  const handleLaunchCamera = () => {
    props.onClose();
    launchCamera({
      width: props.mode === 'avatar' ? 300 : BACKGROUND_WIDTH,
      height: props.mode === 'avatar' ? 300 : BACKGROUND_HEIGHT,
      cropping: true,
    }).then(async image => {
      if (image) {
        const fileName = image.path.substring(image.path.lastIndexOf('/') + 1);
        const newImage: MediaType = {
          uri: image.path,
          name: fileName,
        };
        props.setImage(newImage.uri);
        handleAlert(newImage);
      }
    });
  };

  const handleShowMedia = () => {
    props.onClose();
    setTimeout(() => {
      setShowMedia(true);
    }, 200);
  };

  const imageUri = props.mode === 'avatar' ? data?.avatar : data?.background;

  return (
    <>
      <Modal
        animationIn={'slideInUp'}
        animationOut={'slideOutDown'}
        isVisible={props.isVisible}
        statusBarTranslucent
        useNativeDriver
        hideModalContentWhileAnimating
        style={styles.modal}
        onBackdropPress={props.onClose}
        onBackButtonPress={props.onClose}>
        <View style={styles.container}>
          <TouchableOpacity
            style={[styles.btnUploadFile, styles.borderTop]}
            onPress={handleShowMedia}>
            <Ionicons
              name="person-circle-outline"
              size={26}
              color={color.primary}
            />
            <AppText size={16} ml={12}>
              Xem ảnh
            </AppText>
          </TouchableOpacity>
          {data?.id === user.id && (
            <>
              <TouchableOpacity
                style={[styles.btnUploadFile, styles.borderTop]}
                onPress={handleSelectFile}>
                <IconAddImage />
                <AppText size={16} ml={12}>
                  Chọn ảnh từ thư viện
                </AppText>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.btnUploadFile}
                onPress={handleLaunchCamera}>
                <Ionicons
                  name="camera-outline"
                  size={26}
                  color={color.primary}
                />
                <AppText size={16} ml={12}>
                  Chụp ảnh
                </AppText>
              </TouchableOpacity>
            </>
          )}
        </View>
      </Modal>

      <ModalViewSingleMedia
        isVisible={showMedia}
        onClose={() => setShowMedia(false)}
        file={{
          name: 'avatar.png',
          uri: imageUri || '',
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: color.white,
  },
  modal: {
    flex: 1,
    margin: 0,
    justifyContent: 'flex-end',
  },
  btnUploadFile: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: color.black,
    padding: 12,
  },
  borderTop: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: color.black,
  },
});
