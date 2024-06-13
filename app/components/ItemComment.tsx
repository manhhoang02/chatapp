import color from '@abong.code/theme/color';
import {AppBlock, AppText, AppTouchableOpacity} from '@starlingtech/element';
import {Comment} from 'app/api/comment.type';
import moment from 'moment';
import React, {ReactNode, useState} from 'react';
import {Alert, Pressable, StyleSheet, Text} from 'react-native';
import LinearAvatar from './LinearAvatar';
import light from 'starling/theme/color/light';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useGetUserById} from 'app/api/auth';
import {likeOrDislikeComment, useGetReplyComment} from 'app/api/comment';

const GRAY = '#66676c';
const AVATAR_SIZE = 48;

export default function ({
  item,
  onReply,
}: {
  item: Comment;
  onReply: (item: Comment) => void;
}) {
  const {data: author} = useGetUserById(item.author);
  const {data: replies} = useGetReplyComment(item.postId, item.id);

  const filter = replies
    ? replies.filter(rep => rep.commentId === item.id)
    : [];
  return (
    <Item
      item={item}
      avatarUri={author?.avatar ?? ''}
      avatarSize={AVATAR_SIZE}
      onReply={onReply}
      ListReply={filter.map((rep, index) => {
        return (
          <Item
            key={index}
            avatarSize={AVATAR_SIZE - 10}
            item={rep}
            avatarUri={''}
          />
        );
      })}
    />
  );
}

interface ItemProps {
  avatarSize: number;
  item: Comment;
  avatarUri: string;
  ListReply?: ReactNode;
  onReply?: (item: Comment) => void;
}
function Item(props: ItemProps) {
  const {avatarSize, item, ListReply, onReply} = props;

  const {data: author} = useGetUserById(props.item.author);

  const [isCmtLiked, setIsCmtLiked] = useState(false);
  const [quantityLikes, setQuantityLikes] = useState(0);

  const handleLike = () => {
    setIsCmtLiked(!isCmtLiked);
    if (!isCmtLiked) {
      setQuantityLikes(quantityLikes + 1);
    } else {
      setQuantityLikes(quantityLikes - 1);
    }
    likeOrDislikeComment(item.postId, item.id);
  };

  // consoleLog(replies, 'replies');

  const onLongPress = () => {
    Alert.alert('ok');
  };

  return (
    <AppBlock row>
      <LinearAvatar size={avatarSize} uri={author?.avatar} />

      <AppBlock flex>
        <AppBlock flex mb={10}>
          <Pressable style={styles.bubble} onLongPress={onLongPress}>
            <Text style={styles.author}>
              {author?.firstName + ' ' + author?.lastName}
            </Text>

            <Text style={styles.text}>{item.text}</Text>
          </Pressable>

          <AppBlock mt={6} row>
            <Text style={[styles.text, {color: GRAY}]}>
              {moment(item.createdAt).fromNow(true)}
            </Text>
            <AppTouchableOpacity
              ml={16}
              activeOpacity={0.6}
              onPress={handleLike}>
              <Text
                style={[styles.text, {color: isCmtLiked ? light.red : GRAY}]}>
                Thích
              </Text>
            </AppTouchableOpacity>
            {onReply && (
              <AppTouchableOpacity
                ml={16}
                activeOpacity={0.6}
                onPress={() => onReply(item)}>
                <Text style={[styles.text, {color: GRAY}]}>Trả lời</Text>
              </AppTouchableOpacity>
            )}

            {quantityLikes !== 0 && (
              <AppBlock flex justifyContent="flex-end" row alignItems="center">
                <Ionicons
                  name="heart-circle-outline"
                  size={18}
                  color={light.red}
                />
                <AppText size={13} color={'black'} ml={4}>
                  {quantityLikes.toLocaleString()}
                </AppText>
              </AppBlock>
            )}
          </AppBlock>
        </AppBlock>

        {ListReply}
      </AppBlock>
    </AppBlock>
  );
}

const styles = StyleSheet.create({
  bubble: {
    paddingVertical: 6,
    backgroundColor: light.light_gray,
    paddingHorizontal: 12,
    flex: 1,
    borderRadius: 8,
    width: '100%',
  },
  author: {
    fontSize: 14,
    fontWeight: 'bold',
    color: color.secondary,
  },
  text: {fontSize: 14, fontWeight: '500'},
});
