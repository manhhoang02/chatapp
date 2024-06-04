import {Alert, StyleSheet, Text} from 'react-native';
import React from 'react';
import BottomSheetContainer from 'app/components/Global/BottomSheetContainer';
import {BottomSheetModalMethods} from '@gorhom/bottom-sheet/lib/typescript/types';
import {AppBlock, AppTouchableOpacity} from '@starlingtech/element';
import color from '@abong.code/theme/color';
import AppStyles from 'elements/AppStyles';
import Ionicons from 'react-native-vector-icons/Ionicons';
import light from 'starling/theme/color/light';
import {useDeletePost} from 'app/api/post';
import {showToastMessageSuccess} from '@abong.code/helpers/messageHelper';
import {useHomeStore} from 'app/store/homeStore';
import moment from 'moment';
import {shallow} from 'zustand/shallow';
import {Post} from 'app/api/post.type';
import useAuthStore from 'app/store/authStore';

type Props = {
  bottomRef: React.RefObject<BottomSheetModalMethods>;
  item: Post;
};

export default function ({bottomRef, item}: Props) {
  const userId = useAuthStore(s => s.user.id);
  const [dispatchPost, dispatchSync] = useHomeStore(
    s => [s.dispatchPost, s.dispatchSync],
    shallow,
  );

  const {mutate} = useDeletePost();

  const handleDeletePost = () => {
    Alert.alert('Thông báo!', 'Bạn có muốn xóa bài viết này?', [
      {text: 'HỦY', style: 'cancel'},
      {
        text: 'Đồng ý',
        onPress: () => {
          mutate(
            {postId: item.id},
            {
              onSuccess: response => {
                showToastMessageSuccess(response.message);
                bottomRef.current?.close();
                dispatchSync({post: moment().unix()});
              },
              onError: () => {
                showToastMessageSuccess('Thất bại', 'Gặp lỗi khi xóa bài viết');
              },
            },
          );
        },
      },
    ]);
  };

  const handleEdit = () => {
    bottomRef.current?.close();
    setTimeout(() => {
      dispatchPost({visible: true, data: item, media: item.files});
    }, 200);
  };

  if (item.author !== userId) {
    return null;
  }

  return (
    <BottomSheetContainer bottomRef={bottomRef} snapPoints={['18%']}>
      <AppBlock flex ph={12}>
        {item.author === userId && (
          <AppTouchableOpacity style={styles.btn} onPress={handleEdit}>
            <Ionicons
              name="create-outline"
              size={30}
              color={color.primary}
              style={styles.mr10}
            />
            <Text style={styles.text}>Sửa bài viết</Text>
          </AppTouchableOpacity>
        )}
        <AppTouchableOpacity style={styles.btn} onPress={handleDeletePost}>
          <Ionicons
            name="trash-outline"
            size={30}
            color={light.red}
            style={styles.mr10}
          />
          <Text style={[styles.text, {color: light.red}]}>Xóa bài viết</Text>
        </AppTouchableOpacity>
      </AppBlock>
    </BottomSheetContainer>
  );
}

const styles = StyleSheet.create({
  mr10: {marginRight: 10},
  text: {
    fontSize: 16,
    fontWeight: '500',
    color: color.black,
  },
  btn: {
    ...AppStyles.rowCenter,
    height: 50,
  },
});
