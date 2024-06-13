import {appSize} from '@abong.code/config/AppConstant';
import color from '@abong.code/theme/color';
import {
  useCreateComment,
  useReplyComment,
  useGetComments,
} from 'app/api/comment';
import {likeOrDislikePost, recentlyPostByIdListener} from 'app/api/post';
import React, {cloneElement, useEffect, useState} from 'react';

import {Keyboard, StyleSheet, TextInput, TouchableOpacity} from 'react-native';
import ItemComment from '../ItemComment';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Comment} from 'app/api/comment.type';
import {showToastMessageError} from '@abong.code/helpers/messageHelper';
import {
  AppBlock,
  AppPressable,
  AppText,
  AppTouchableOpacity,
} from '@starlingtech/element';
import light from 'starling/theme/color/light';
import IconHeart from 'assets/icons/IconHeart';
import AppStyles from 'elements/AppStyles';
import {useKeyboard} from 'app/hook/keyboardHook';
import IconSend from 'assets/icons/IconSend';
import IconAngleRight from 'assets/icons/IconAngleRight';
import useAuthStore from 'app/store/authStore';
import DocumentPicker from 'react-native-document-picker';
import {useDataStore} from 'app/store/dataStore';
import BottomSheetContainer from '../Global/BottomSheetContainer';
import {BottomSheetFlatList} from '@gorhom/bottom-sheet';
import {BottomSheetModalMethods} from '@gorhom/bottom-sheet/lib/typescript/types';

type Props = {
  bottomRef: React.RefObject<BottomSheetModalMethods>;
  postId: string;
};

export default function ({bottomRef, postId}: Props) {
  const user = useAuthStore(s => s.user);
  const postById = useDataStore(s => s.recentlyData.postById);
  const {bottom} = useSafeAreaInsets();

  const [comment, setComment] = useState('');
  const [media, setMedia] = useState<string[]>([]);

  const [quantityLikes, setQuantityLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  const [showActions, setShowActions] = useState(false);
  const [inputHeight, setInputHeight] = useState(40);
  const [reload, setReload] = useState(0);

  const [isReplying, setIsReplying] = useState({
    status: false,
    replyComment: undefined as Comment | undefined,
  });

  const {mutate: createCmt} = useCreateComment();
  const {mutate: replyCmt} = useReplyComment();
  const {data} = useGetComments({postId, reload});

  const {keyboardVisible} = useKeyboard();

  useEffect(() => {
    const postByIdListener = recentlyPostByIdListener(postId);
    // const commentListener = recentlyCommentListener(postId);
    return () => {
      postByIdListener();
      // commentListener();
    };
  }, [postId]);

  useEffect(() => {
    if (postById) {
      setQuantityLikes(postById.users_liked.length);
      setIsLiked(postById.users_liked.includes(user.id));
    }
  }, [postById, user.id]);

  const handleCreateComment = () => {
    createCmt(
      {author: user.id, text: comment, files: media, postId},
      {
        onSuccess: () => {
          setComment('');
          setMedia([]);
          Keyboard.dismiss();
          setReload(reload + 1);
        },
        onError: () => {
          showToastMessageError('Đã có lỗi cảy ra!');
        },
      },
    );
  };

  const handleReplyComment = () => {
    if (isReplying.status && isReplying.replyComment) {
      replyCmt(
        {
          author: user.id,
          text: comment,
          files: media,
          postId,
          commentId: isReplying.replyComment.id,
        },
        {
          onSuccess: () => {
            setComment('');
            setMedia([]);
            setIsReplying({
              status: false,
              replyComment: undefined,
            });
            Keyboard.dismiss();
            setReload(reload + 1);
          },
          onError: () => {
            showToastMessageError('Đã có lỗi cảy ra!');
          },
        },
      );
    }
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    if (!isLiked) {
      setQuantityLikes(quantityLikes + 1);
    } else {
      setQuantityLikes(quantityLikes - 1);
    }
    likeOrDislikePost(postId, user.id);
  };

  const handleSelectFile = async () => {
    try {
      const results = await DocumentPicker.pick({
        allowMultiSelection: true,
        type: [DocumentPicker.types.video, DocumentPicker.types.images],
      });
      const tmp: string[] = [];
      results.forEach(result => {
        tmp.push(result.uri);
      });

      setMedia(tmp);
    } catch (error) {
      if (DocumentPicker.isCancel(error)) {
      } else {
        throw error;
      }
    }
  };

  const onReply = (item: Comment) => {
    setIsReplying({
      status: true,
      replyComment: item,
    });
  };

  const renderItem = ({item}: {item: Comment}) => {
    return <ItemComment item={item} onReply={onReply} />;
  };

  const HeaderComponent = (
    <AppBlock padding={[8, 22, 8, 12]}>
      <AppBlock style={AppStyles.rowCenterBetween} mb={8}>
        <AppText size={16} weight="700" color={color.primary}>
          Bình luận
        </AppText>
        <Ionicons
          name="close"
          size={24}
          onPress={() => bottomRef.current?.close()}
        />
      </AppBlock>
      <AppBlock alignSelf="flex-end" row alignItems="center">
        <TouchableOpacity style={AppStyles.rowCenter} onPress={handleLike}>
          <IconHeart isLiked={isLiked} width={20} />
        </TouchableOpacity>
        <AppText color={'black'} ml={8}>
          {quantityLikes.toLocaleString()}
        </AppText>
      </AppBlock>
    </AppBlock>
  );
  const handleCommentsChange = (newText: string) => {
    setComment(newText);
    const newHeight = newText.split('\n').length * 20 + 20;
    setInputHeight(newHeight);
  };

  const FooterComponent = (
    <AppBlock>
      {isReplying.status && (
        <AppBlock
          padding={[12, 16]}
          style={[AppStyles.rowCenterBetween, styles.borderTop]}>
          <AppText>Trả lời: {isReplying.replyComment?.text}</AppText>

          <Ionicons
            name="close"
            size={24}
            onPress={() =>
              setIsReplying({
                status: false,
                replyComment: undefined,
              })
            }
          />
        </AppBlock>
      )}

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
          focusable={isReplying.status}
          autoFocus={isReplying.status}
          textAlignVertical="bottom"
          style={[styles.textInput, {height: Math.max(40, inputHeight)}]}
          onChangeText={handleCommentsChange}
        />

        <TouchableOpacity
          disabled={!comment}
          onPress={
            isReplying.status ? handleReplyComment : handleCreateComment
          }>
          <IconSend />
        </TouchableOpacity>
      </AppBlock>

      {showActions && (
        <>
          <AppBlock
            row
            alignItems="center"
            ph={12}
            style={styles.borderTop}
            height={40}>
            <AppTouchableOpacity>
              <Ionicons name="camera-outline" size={30} />
            </AppTouchableOpacity>
            <AppTouchableOpacity mh={10} onPress={handleSelectFile}>
              <Ionicons name="image-outline" size={30} />
            </AppTouchableOpacity>
            <AppTouchableOpacity>
              <Ionicons name="happy-outline" size={30} />
            </AppTouchableOpacity>
          </AppBlock>
        </>
      )}
    </AppBlock>
  );

  return (
    <BottomSheetContainer snapPoints={['100%']} bottomRef={bottomRef}>
      {cloneElement(HeaderComponent)}
      <BottomSheetFlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(_, index) => index.toString()}
        contentContainerStyle={{
          paddingHorizontal: appSize(10),
        }}
        showsVerticalScrollIndicator={false}
        scrollToOverflowEnabled
      />
      {cloneElement(FooterComponent)}
    </BottomSheetContainer>
  );
}
const styles = StyleSheet.create({
  modal: {margin: 0, flex: 1},
  borderTop: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: color.secondary,
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
