import {useAppContext} from '@abong.code/context/AppProvider';
import color from '@abong.code/theme/color';
import {AppBlock, AppText, AppTouchableOpacity} from '@starlingtech/element';
import {likeOrDislikePost} from 'app/api/post';
import {Post} from 'app/api/post.type';
import React, {useRef, useState} from 'react';
import {
  Alert,
  ImageBackground,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearAvatar from './LinearAvatar';
import Icon2Users from 'assets/icons/Icon2Users';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AppStyles from 'elements/AppStyles';
import {Pressable} from 'react-native';
import IconHeart from 'assets/icons/IconHeart';
import IconComments from 'assets/icons/IconComments';
import moment from 'moment';
import ModalComment from './modals/ModalComment';
import IconSend from 'assets/icons/IconSend';
import IconShare from 'assets/icons/IconShare';
import AppConstant from '@abong.code/config/AppConstant';
import {BottomSheetModal} from '@gorhom/bottom-sheet';

interface Props {
  item: Post;
}

const images = [
  'https://cdn.britannica.com/70/234870-050-D4D024BB/Orange-colored-cat-yawns-displaying-teeth.jpg',
  'https://cdn.shopify.com/s/files/1/0997/4496/articles/erik-jan-leusink-HrMD7MngiBE-unsplash_37dd402254130b322e3a175f420c3175_2000_f12036e7-b02a-4bd9-bec0-02ed6f09926c.jpg?v=1588962988',
  'https://www.oakhurstvet.com/blog/wp-content/uploads/2023/02/iStock-1419313949.jpg',
];

const BLACK_80 = '#00000080';
const RED = '#FF204E';

export default function (props: Props) {
  const {item} = props;
  const {user} = useAppContext();
  const bottomSheetRef = useRef<BottomSheetModal>(null);

  const [isLiked, setIsLiked] = useState(
    item.users_liked.some(e => e === user._id) || false,
  );
  const [quantityLikes, setQuantityLikes] = useState(
    item.users_liked.length || 0,
  );

  const handleLike = () => {
    setIsLiked(!isLiked);
    if (!isLiked) {
      setQuantityLikes(quantityLikes + 1);
    } else {
      setQuantityLikes(quantityLikes - 1);
    }
    likeOrDislikePost(item._id);
  };

  const handleComment = () => {
    bottomSheetRef.current?.present();
  };

  const onShare = async () => {
    try {
      const result = await Share.share({
        message: item.description + '' + item.files,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error: any) {
      Alert.alert(error.message);
    }
  };

  // console.log(JSON.stringify(item, null, 2));

  return (
    <>
      <View style={styles.container}>
        <AppBlock row>
          <LinearAvatar uri={item.author.avatar} size={53} online />
          <AppBlock flex>
            <AppText size={16} weight="800">
              {item.author.first_name + ' ' + item.author.last_name}
            </AppText>
            <AppBlock row alignItems="center">
              <AppText size={13} weight="500" style={{color: BLACK_80}} mr={4}>
                {moment(item.createdAt).locale('vi').fromNow()} •
              </AppText>
              <Icon2Users color={BLACK_80} />
            </AppBlock>
          </AppBlock>

          <AppTouchableOpacity width={24} height={24} style={AppStyles.center}>
            <Ionicons name="ellipsis-vertical" size={18} color={color.black} />
          </AppTouchableOpacity>
        </AppBlock>

        <Text style={styles.desc} numberOfLines={2}>
          {item.description}
        </Text>

        {/* <AppBlock mt={4} row wrap>
          {tags.map(t => (
            <Text key={t} style={styles.tag}>
              #{t}
            </Text>
          ))}
        </AppBlock> */}

        <Pressable style={AppStyles.fill}>
          <ImageBackground
            source={{uri: images[0]}}
            style={styles.image}
            resizeMode="cover">
            {images.length > 1 ? (
              <View style={styles.blur}>
                {images.map((_, index) => {
                  const dColor = index === 0 ? 'white' : '#93919C';
                  return (
                    <AppText
                      key={index}
                      size={25}
                      style={{color: dColor}}
                      mh={2}>
                      •
                    </AppText>
                  );
                })}
              </View>
            ) : null}
          </ImageBackground>
        </Pressable>

        <AppBlock style={AppStyles.rowCenterBetween} pv={6}>
          <AppBlock row alignItems="center">
            <Ionicons name="heart-circle-outline" size={20} color={RED} />
            <AppText size={13} color={BLACK_80} ml={4}>
              {quantityLikes.toLocaleString()}
            </AppText>
          </AppBlock>

          <AppText size={13} color={BLACK_80}>
            {item.total_comments} bình luận • 0 lượt chia sẻ
          </AppText>
        </AppBlock>

        <AppBlock
          row
          alignItems="center"
          justifyContent="space-around"
          style={styles.actionsField}
          pv={12}>
          <TouchableOpacity style={AppStyles.rowCenter} onPress={handleLike}>
            <IconHeart isLiked={isLiked} width={20} />
            <Text style={[styles.btnText, isLiked && {color: RED}]}>Thích</Text>
          </TouchableOpacity>
          <TouchableOpacity style={AppStyles.rowCenter} onPress={handleComment}>
            <IconComments width={20} />
            <Text style={styles.btnText}>Bình luận</Text>
          </TouchableOpacity>
          <TouchableOpacity style={AppStyles.rowCenter}>
            <IconSend width={20} />
            <Text style={styles.btnText}>Gửi</Text>
          </TouchableOpacity>
          <TouchableOpacity style={AppStyles.rowCenter} onPress={onShare}>
            <IconShare width={20} />
            <Text style={styles.btnText}>Chia sẻ</Text>
          </TouchableOpacity>
        </AppBlock>
      </View>

      <ModalComment bottomRef={bottomSheetRef} commentPostId={item._id} />
    </>
  );
}

const styles = StyleSheet.create({
  actionsField: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: color.primary,
  },
  btnText: {
    color: color.primary,
    fontSize: 15,
    fontWeight: '500',
    marginLeft: 8,
  },
  image: {
    width: AppConstant.SCREEN_WIDTH,
    height: 210,
    marginHorizontal: -12,
    marginTop: 10,
    borderWidth: 1,
    borderColor: 'white',
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  blur: {
    height: 27,
    width: '100%',
    backgroundColor: '#00000080',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  tag: {
    fontSize: 14,
    fontWeight: '500',
    color: BLACK_80,
    marginRight: 6,
  },
  desc: {
    fontWeight: '500',
    color: 'black',
    fontSize: 14,
    marginTop: 6,
    lineHeight: 20.5,
  },
  container: {
    backgroundColor: 'white',
    paddingTop: 12,
    paddingHorizontal: 12,
  },
});
