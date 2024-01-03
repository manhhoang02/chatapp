import AppConstant, {appSize} from '@abong.code/config/AppConstant';
import color from '@abong.code/theme/color';
import {useGetComments, createComment} from 'app/api/comment';
import {getPost} from 'app/api/post';
import React, {useEffect, useState} from 'react';

import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {Modalize} from 'react-native-modalize';
import ItemComment from '../ItemComment';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Portal} from 'react-native-portalize';
import {Comment} from 'app/api/comment.type';
import moment from 'moment';
import {showToastMessageError} from '@abong.code/helpers/messageHelper';

type Props = {
  modalizeRef: any;
  commentPostId: string;
};
export default function ({modalizeRef, commentPostId}: Props) {
  const {bottom} = useSafeAreaInsets();
  const [quantityLikes, setQuantityLikes] = useState(0);
  const [page, setPage] = useState(1);
  const [comment, setComment] = useState('');
  const [reLoad, setReLoad] = useState(0);

  const {data} = useGetComments(
    commentPostId,
    page,
    AppConstant.LIST_SIZE,
    reLoad,
  );
  useEffect(() => {
    commentPostId &&
      getPost(commentPostId).then(res => {
        setQuantityLikes(res.users_liked.length);
      });
  }, [commentPostId]);
  const handleCreateComment = () => {
    const params = new FormData();
    params.append('postId', commentPostId);
    params.append('text', comment);

    createComment(params)
      .then(() => {
        setReLoad(moment().unix());
        setComment('');
      })
      .catch(err => showToastMessageError('Error!', err));
  };

  const renderItem = ({item}: {item: Comment}) => {
    return <ItemComment key={item._id} item={item} />;
  };
  const HeaderComponent = quantityLikes !== 0 && (
    <View style={styles.contentQuantity}>
      <Image
        source={require('assets/image/like_fb.png')}
        style={{
          width: appSize(16),
          height: appSize(16),
        }}
      />
      <Text style={styles.textQuantity}>{quantityLikes}</Text>
    </View>
  );
  const FooterComponent = (
    <View style={[styles.contentInput, {marginBottom: bottom}]}>
      <TextInput
        value={comment}
        placeholder="Viết bình luận..."
        placeholderTextColor={color.black04}
        style={styles.textInput}
        onChangeText={setComment}
      />
      <TouchableOpacity disabled={!comment} onPress={handleCreateComment}>
        <Ionicons
          name="send-sharp"
          size={30}
          color={comment ? color.primary : color.disabled}
        />
      </TouchableOpacity>
    </View>
  );

  return (
    <Portal>
      <Modalize
        ref={modalizeRef}
        modalStyle={{paddingHorizontal: appSize(10)}}
        HeaderComponent={HeaderComponent}
        FooterComponent={FooterComponent}
        flatListProps={{
          data: data,
          renderItem: renderItem,
          keyExtractor: (_, index) => index.toString(),
          showsVerticalScrollIndicator: false,
          // onEndReached: () => {
          //   setPage(page + 1);
          // },
          // onEndReachedThreshold: 0.1,
        }}
        childrenStyle={{marginTop: appSize(10)}}
      />
    </Portal>
  );
}
const styles = StyleSheet.create({
  contentQuantity: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: appSize(10),
  },
  textQuantity: {
    marginLeft: appSize(5),
    color: color.black,
    fontSize: appSize(16),
  },
  container: {
    padding: appSize(10),
    flex: 1,
  },
  contentInput: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: appSize(10),
    paddingTop: appSize(8),
  },
  textInput: {
    backgroundColor: color.black006,
    padding: appSize(10),
    borderRadius: appSize(50),
    flex: 1,
    marginRight: appSize(10),
  },
});
