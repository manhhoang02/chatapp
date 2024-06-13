import React, {useEffect, useState} from 'react';
import AppConstant, {appSize} from '@abong.code/config/AppConstant';
import {Text, TextInput, TouchableOpacity} from 'react-native';
import {StyleSheet, View} from 'react-native';
import Modal from 'react-native-modal';
import color from '@abong.code/theme/color';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DocumentPicker from 'react-native-document-picker';
import {
  showToastMessageError,
  showToastMessageSuccess,
} from '@abong.code/helpers/messageHelper';
import light from 'starling/theme/color/light';
import IconAddImage from 'assets/icons/home/IconAddImage';
import {AppText} from '@starlingtech/element';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import CreatePostMediaField from '../CreatePostMediaField';
import AppStyles from 'elements/AppStyles';
import {MediaType, useHomeStore} from 'app/store/homeStore';
import {shallow} from 'zustand/shallow';
import useAuthStore from 'app/store/authStore';
import {useCreatePost, useEditPost} from 'app/api/post';
import {getImagePath, uploadToCloudStorage} from 'helper/uploadToCloudStorage';
import {launchCamera} from 'helper/launchCamera';
import AppProcessingButton from '@abong.code/elements/AppProcessingButton';

export default function () {
  const user = useAuthStore(s => s.user);

  const {top} = useSafeAreaInsets();

  const [post, dispatchPost] = useHomeStore(
    s => [s.post, s.dispatchPost],
    shallow,
  );

  const [description, setDescription] = useState('');
  const [isPosting, setIsPosting] = useState(false);

  useEffect(() => {
    if (post.data) {
      setDescription(post.data.description);
    }
  }, [post.data]);

  const {mutate: createPost} = useCreatePost();
  const {mutate: editPost} = useEditPost();

  const onClose = () => {
    setDescription('');
    dispatchPost({visible: false, media: [], data: undefined});
    setIsPosting(false);
  };

  const handleCreatePost = async () => {
    setIsPosting(true);

    const files = await Promise.all(
      post.media.map(async file => ({
        uri: await getImagePath(file),
        name: file.name,
      })),
    );

    if (post.data) {
      editPost(
        {
          postId: post.data.id,
          description,
          files: files,
        },
        {
          onSuccess: async res => {
            showToastMessageSuccess(res.message);
            onClose();
          },
          onError: () => {
            showToastMessageError('Đã có lỗi xảy ra');
            setIsPosting(false);
          },
        },
      );
      return;
    }
    createPost(
      {
        author: user.id,
        description,
        files: files,
      },
      {
        onSuccess: res => {
          showToastMessageSuccess(res.message);
          onClose();
        },
        onError: () => {
          showToastMessageError('Đã có lỗi xảy ra');
          setIsPosting(false);
        },
      },
    );
  };

  const handleSelectFile = async () => {
    try {
      const results = await DocumentPicker.pick({
        allowMultiSelection: true,
        type: [DocumentPicker.types.video, DocumentPicker.types.images],
      });

      const media: MediaType[] = results.map(file => {
        return {uri: file.uri, name: file.name || ''};
      });

      media.map(async file => {
        return await uploadToCloudStorage(file);
      });

      dispatchPost({media});
    } catch (error) {
      if (DocumentPicker.isCancel(error)) {
      } else {
        throw error;
      }
    }
  };

  const handleLaunchCamera = () => {
    launchCamera().then(async image => {
      if (image) {
        const fileName = image.path.substring(image.path.lastIndexOf('/') + 1);
        const newImage: MediaType = {
          uri: image.path,
          name: fileName,
        };

        await uploadToCloudStorage(newImage);

        dispatchPost({media: [newImage]});
      }
    });
  };

  const inputHeight = post.media.length > 0 ? 55 : '45%';
  const disabled = !description && post.media.length === 0;

  return (
    <Modal
      animationIn={'slideInUp'}
      animationOut={'slideOutDown'}
      isVisible={post.visible}
      statusBarTranslucent
      useNativeDriver
      hasBackdrop={false}
      hideModalContentWhileAnimating
      style={styles.modal}
      onBackdropPress={onClose}>
      <View style={[styles.container, {paddingTop: top}]}>
        <KeyboardAwareScrollView contentContainerStyle={AppStyles.grow}>
          <View style={styles.header}>
            <Ionicons
              name="arrow-back-outline"
              size={24}
              onPress={onClose}
              color={color.primary}
            />
            <Text style={styles.textTitle}>
              {post.data ? 'Chỉnh sửa bài viết' : 'Tạo bài viết'}
            </Text>

            <AppProcessingButton
              width={80}
              height={40}
              backgroundColor={disabled ? light.light_gray : color.primary}
              text={post.data ? 'Lưu' : 'Đăng'}
              onPress={handleCreatePost}
              disabled={disabled || isPosting}
              processing={isPosting}
              textStyle={{
                fontSize: appSize(15),
                color: disabled ? light.gray : color.white,
              }}
            />
          </View>

          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="Bạn đang nghĩ gì?"
            placeholderTextColor={color.placeholder}
            style={[styles.input, {height: inputHeight}]}
            textAlignVertical="top"
            multiline
          />

          <CreatePostMediaField />

          <TouchableOpacity
            style={[styles.btnUploadFile, styles.borderTop]}
            onPress={handleSelectFile}>
            <IconAddImage />
            <AppText size={16} ml={12}>
              Thêm ảnh/video
            </AppText>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.btnUploadFile}
            onPress={handleLaunchCamera}>
            <Ionicons name="camera-outline" size={26} color={color.primary} />
            <AppText size={16} ml={12}>
              Camera
            </AppText>
          </TouchableOpacity>
        </KeyboardAwareScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  row1: {
    width: '100%',
    flex: 1,
    height: AppConstant.UI_WIDTH * 0.5,
  },
  input: {
    color: color.black,
    fontSize: 24,
    paddingHorizontal: 12,
  },
  postBtn: {
    paddingHorizontal: appSize(20),
    paddingVertical: appSize(8),
    borderRadius: appSize(8),
  },
  container: {
    flexGrow: 1,
    backgroundColor: color.white,
  },
  modal: {
    flex: 1,
    margin: 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: color.primary,
  },
  textTitle: {
    flex: 1,
    fontWeight: 'bold',
    fontSize: appSize(20),
    color: color.primary,
    marginLeft: 12,
  },
  textBtn: {
    fontWeight: 'bold',
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
