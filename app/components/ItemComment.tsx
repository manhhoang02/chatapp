import color from '@abong.code/theme/color';
import {AppBlock, AppText, AppTouchableOpacity} from '@starlingtech/element';
import {Comment} from 'app/api/comment.type';
import moment from 'moment';
import React, {ReactNode, useState} from 'react';
import {Alert, Pressable, StyleSheet, Text} from 'react-native';
import LinearAvatar from './LinearAvatar';
import light from 'vn.starlingTech/theme/color/light';
import Ionicons from 'react-native-vector-icons/Ionicons';

const GRAY = '#66676c';
const AVATAR_SIZE = 48;

export default function ({item}: {item: Comment}) {
  return (
    <Item
      item={item}
      avatarUri={item.author.avatar}
      avatarSize={AVATAR_SIZE}
      renderListReply={({item: cmt, index}) => (
        <Item
          key={index}
          avatarSize={AVATAR_SIZE - 8}
          item={cmt}
          avatarUri={cmt.author.avatar}
        />
      )}
    />
  );
}

interface ItemProps {
  avatarSize: number;
  item: Comment;
  avatarUri: string;
  renderListReply?: ({
    item,
    index,
  }: {
    item: Comment;
    index: number;
  }) => ReactNode;
}
function Item(props: ItemProps) {
  const {avatarSize, item, avatarUri, renderListReply} = props;

  const [isCmtLiked, setIsCmtLiked] = useState(false);
  const [quantityLikes, setQuantityLikes] = useState(0);

  const handleLike = () => {
    setIsCmtLiked(!isCmtLiked);
    if (!isCmtLiked) {
      setQuantityLikes(quantityLikes + 1);
    } else {
      setQuantityLikes(quantityLikes - 1);
    }
  };

  const onLongPress = () => {
    Alert.alert('ok');
  };

  return (
    <AppBlock row>
      <LinearAvatar size={avatarSize} uri={avatarUri} />

      <AppBlock flex>
        <AppBlock flex mb={10}>
          <Pressable style={styles.bubble} onLongPress={onLongPress}>
            <Text style={styles.author}>
              {item.author.first_name + ' ' + item.author.last_name}
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
            <AppTouchableOpacity ml={16} activeOpacity={0.6}>
              <Text style={[styles.text, {color: GRAY}]}>Trả lời</Text>
            </AppTouchableOpacity>

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

        {item.comments && item.comments.length > 0
          ? item.comments.map((cmt, index) =>
              renderListReply ? renderListReply({item: cmt, index}) : null,
            )
          : null}
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
