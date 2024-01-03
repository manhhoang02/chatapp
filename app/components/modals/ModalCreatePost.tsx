import React, {useState} from 'react';
import {appSize} from '@abong.code/config/AppConstant';
import {Image, Text, TextInput, TouchableOpacity} from 'react-native';
import {StyleSheet, View} from 'react-native';
import Modal from 'react-native-modal';
import color from '@abong.code/theme/color';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {BlurView} from '@react-native-community/blur';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DocumentPicker, {
  DocumentPickerResponse,
} from 'react-native-document-picker';
import Video from 'react-native-video';
import {createPost} from 'app/api/post';
import {
  showToastMessageError,
  showToastMessageSuccess,
} from '@abong.code/helpers/messageHelper';

type Props = {
  isVisible: boolean;
  onClose: () => void;
};
export default function ({isVisible, onClose}: Props) {
  const {top} = useSafeAreaInsets();
  const [textPost, setTextPost] = useState('');
  const [files, setFiles] = useState<DocumentPickerResponse[]>([]);

  const handleCreatePost = async () => {
    try {
      const params = new FormData();
      for (let file of files) {
        params.append('files', file);
      }
      params.append('description', textPost);
      createPost(params)
        .then(() => {
          showToastMessageSuccess('Thành công!', 'Đã đăng bài viết mới');
          setFiles([]);
          setTextPost('');
          onClose();
        })
        .catch(err => showToastMessageError('Error!', err.message));
    } catch (error) {}
  };
  const handleSelectFile = async () => {
    try {
      const results = await DocumentPicker.pickMultiple({
        allowMultiSelection: true,
        type: [DocumentPicker.types.video, DocumentPicker.types.images],
      });
      setFiles(results);
    } catch (error) {
      if (DocumentPicker.isCancel(error)) {
        // Alert.alert('Canceled from MultipleFile picker')
      } else {
        // Alert.alert('unknown error: ' + JSON.stringify(err))
        throw error;
      }
    }
  };
  return (
    <Modal
      animationIn={'fadeInUp'}
      animationOut={'fadeOutDown'}
      animationInTiming={300}
      animationOutTiming={300}
      backdropColor="transparent"
      isVisible={isVisible}
      style={[styles.modal, styles.noMargin]}
      onBackdropPress={onClose}>
      <BlurView
        style={styles.blur}
        blurType="xlight"
        blurAmount={23}
        overlayColor="transparent">
        <View style={[styles.container, {paddingTop: top}]}>
          <View style={styles.header}>
            <Ionicons
              color={color.black}
              name="ios-close-circle-outline"
              size={24}
              onPress={() => {
                onClose();
                setTextPost('');
                setFiles([]);
              }}
            />
            <Text style={styles.textTitle}>Tạo bài viết</Text>
            <TouchableOpacity
              style={{
                backgroundColor:
                  textPost || files.length > 0 ? color.primary : color.border,
                paddingHorizontal: appSize(10),
                paddingVertical: appSize(5),
                borderRadius: appSize(5),
              }}
              disabled={!textPost && files.length === 0}
              onPress={handleCreatePost}>
              <Text
                style={[
                  styles.textBtn,
                  {
                    color:
                      textPost || files.length > 0
                        ? color.white
                        : color.placeholder,
                  },
                ]}>
                Đăng
              </Text>
            </TouchableOpacity>
          </View>
          <TextInput
            value={textPost}
            onChangeText={setTextPost}
            placeholder="Bạn đang nghĩ gì?"
            placeholderTextColor={color.placeholder}
            style={{color: color.black}}
          />
          {files.length > 0 && (
            <View>
              {files[0].type === 'image/jpeg' ||
              files[0].type === 'image/png' ? (
                <Image
                  source={{uri: files[0].uri}}
                  style={{
                    // width: '100%',
                    height: appSize(200),
                  }}
                />
              ) : (
                <Video
                  controls={true}
                  source={{
                    uri: files[0].uri,
                  }}
                  style={{
                    width: appSize(300),
                    height: appSize(150),
                  }}
                  resizeMode={'contain'}
                />
              )}
            </View>
          )}
          <TouchableOpacity
            style={styles.btnUploadFile}
            onPress={handleSelectFile}>
            <Image
              source={require('assets/image/image.png')}
              style={{
                width: appSize(30),
                height: appSize(30),
                marginRight: appSize(10),
              }}
              resizeMode={'contain'}
            />
            <Text style={{color: color.black}}>Thêm ảnh/video</Text>
          </TouchableOpacity>
        </View>
      </BlurView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    // borderWidth: appSize(1),
    borderColor: color.black04,
    borderBottomLeftRadius: appSize(10),
    borderBottomRightRadius: appSize(10),
    paddingHorizontal: appSize(16),
  },
  noMargin: {
    marginHorizontal: 0,
    marginVertical: 0,
  },
  modal: {
    justifyContent: 'flex-start',
  },
  blur: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: appSize(20),
  },
  textTitle: {
    fontWeight: 'bold',
    fontSize: appSize(18),
    color: color.black,
  },
  textBtn: {
    fontWeight: 'bold',
  },
  btnUploadFile: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: appSize(100),
  },
});
