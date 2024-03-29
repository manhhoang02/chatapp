import AppConstant, {appSize} from '@abong.code/config/AppConstant';
import color from '@abong.code/theme/color';
import {useGetComments, createComment} from 'app/api/comment';
import {getPost, likeOrDislikePost} from 'app/api/post';
import React, {cloneElement, useEffect, useState} from 'react';

import {StyleSheet, TextInput, TouchableOpacity} from 'react-native';
import ItemComment from '../ItemComment';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Comment} from 'app/api/comment.type';
import moment from 'moment';
import {showToastMessageError} from '@abong.code/helpers/messageHelper';
import {
  AppBlock,
  AppPressable,
  AppText,
  AppTouchableOpacity,
} from '@starlingtech/element';
import light from 'vn.starlingTech/theme/color/light';
import IconHeart from 'assets/icons/IconHeart';
import {useAppContext} from '@abong.code/context/AppProvider';
import AppStyles from 'elements/AppStyles';
import {useKeyboard} from 'app/hook/keyboardHook';
import IconSend from 'assets/icons/IconSend';
import BottomSheetContainer from '../Global/BottomSheetContainer';
import {BottomSheetModalMethods} from '@gorhom/bottom-sheet/lib/typescript/types';
import {BottomSheetFlatList} from '@gorhom/bottom-sheet';
import IconAngleRight from 'assets/icons/IconAngleRight';

type Props = {
  bottomRef: React.RefObject<BottomSheetModalMethods>;
  commentPostId: string;
};

let page = 1;
export default function ({bottomRef, commentPostId}: Props) {
  const {user} = useAppContext();
  const {bottom} = useSafeAreaInsets();
  const [quantityLikes, setQuantityLikes] = useState(0);
  const [comment, setComment] = useState('');
  const [reLoad, setReLoad] = useState(0);
  const [showActions, setShowActions] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [inputHeight, setInputHeight] = useState(40);

  const {data} = useGetComments(
    commentPostId,
    page,
    AppConstant.LIST_SIZE,
    reLoad,
  );

  const {keyboardVisible} = useKeyboard();

  useEffect(() => {
    commentPostId &&
      getPost(commentPostId).then(res => {
        setQuantityLikes(res.users_liked.length);

        const liked = res.users_liked.some(e => e === user._id);
        setIsLiked(liked);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const handleLike = () => {
    setIsLiked(!isLiked);
    if (!isLiked) {
      setQuantityLikes(quantityLikes + 1);
    } else {
      setQuantityLikes(quantityLikes - 1);
    }
    likeOrDislikePost(commentPostId);
  };

  const renderItem = ({item}: {item: Comment}) => {
    return <ItemComment item={item} />;
  };
  const HeaderComponent = (
    <AppBlock style={AppStyles.rowCenterBetween} pv={8} pl={12} pr={22}>
      <AppBlock row alignItems="center">
        <Ionicons name="heart-circle-outline" size={20} color={light.red} />
        <AppText color={'black'} ml={4}>
          {quantityLikes.toLocaleString()}
        </AppText>
      </AppBlock>
      <TouchableOpacity style={AppStyles.rowCenter} onPress={handleLike}>
        <IconHeart isLiked={isLiked} width={20} />
      </TouchableOpacity>
    </AppBlock>
  );
  const handleCommentsChange = (newText: string) => {
    setComment(newText);
    const newHeight = newText.split('\n').length * 20 + 20;
    setInputHeight(newHeight);
  };

  const FooterComponent = (
    <AppBlock>
      <AppBlock
        row
        style={styles.borderTop}
        padding={[10, 10, 10 + bottom]}
        alignItems="center">
        <AppPressable mr={10} onPress={() => setShowActions(!showActions)}>
          <IconAngleRight show={showActions} color={color.primary} />
        </AppPressable>

        <TextInput
          value={comment}
          placeholder="Viết bình luận..."
          placeholderTextColor={light.black_70}
          multiline={keyboardVisible}
          numberOfLines={5}
          textAlignVertical="bottom"
          style={[styles.textInput, {height: Math.max(40, inputHeight)}]}
          onChangeText={handleCommentsChange}
        />

        <TouchableOpacity disabled={!comment} onPress={handleCreateComment}>
          <IconSend />
        </TouchableOpacity>
      </AppBlock>

      {showActions && (
        <AppBlock
          row
          alignItems="center"
          ph={12}
          style={styles.borderTop}
          height={40}>
          <AppTouchableOpacity>
            <Ionicons name="camera-outline" size={30} />
          </AppTouchableOpacity>
          <AppTouchableOpacity mh={10}>
            <Ionicons name="image-outline" size={30} />
          </AppTouchableOpacity>
          <AppTouchableOpacity>
            <Ionicons name="happy-outline" size={30} />
          </AppTouchableOpacity>
        </AppBlock>
      )}
    </AppBlock>
  );

  return (
    <BottomSheetContainer bottomRef={bottomRef}>
      {cloneElement(HeaderComponent)}
      <BottomSheetFlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(_, index) => index.toString()}
        contentContainerStyle={{paddingHorizontal: appSize(10)}}
        showsVerticalScrollIndicator={false}
        scrollToOverflowEnabled
      />
      {cloneElement(FooterComponent)}
    </BottomSheetContainer>
  );
}
const styles = StyleSheet.create({
  borderTop: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: color.secondary,
  },
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
    backgroundColor: light.light_gray,
    paddingHorizontal: appSize(12),
    borderRadius: appSize(20),
    flex: 1,
    maxHeight: 100,
    marginRight: appSize(10),
    fontSize: 14,
    color: color.primary,
  },
});
