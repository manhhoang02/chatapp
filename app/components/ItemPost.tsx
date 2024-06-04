import color from '@abong.code/theme/color';
import {AppBlock, AppText, AppTouchableOpacity} from '@starlingtech/element';
import {likeOrDislikePost} from 'app/api/post';
import {Post} from 'app/api/post.type';
import React, {useRef, useState} from 'react';
import {
  Alert,
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
import IconShare from 'assets/icons/IconShare';
import AppConstant from '@abong.code/config/AppConstant';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import {size} from 'lodash';
import ModalPostActions from './modals/ModalPostActions';
import {useGetUserById} from 'app/api/auth';
import useAuthStore from 'app/store/authStore';
import {MediaItem} from './CreatePostMediaField';
import ModalViewMedia from './modals/ModalViewMedia';
import {useNavigation} from '@react-navigation/native';
import {ParamsStack} from 'app/navigation/params';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

interface Props {
  item: Post;
}

const BLACK_80 = '#00000080';
const RED = '#FF204E';

export default function ({item}: Props) {
  const user = useAuthStore(s => s.user);

  const navigation = useNavigation<NativeStackNavigationProp<ParamsStack>>();

  const commentSheetRef = useRef<BottomSheetModal>(null);
  const actionsSheetRef = useRef<BottomSheetModal>(null);

  const [isLiked, setIsLiked] = useState(
    item.users_liked.some(e => e === user.id) || false,
  );
  const [quantityLikes, setQuantityLikes] = useState(
    item.users_liked.length || 0,
  );
  const [needReload, setNeedReload] = useState(0);
  const [showView, setShowView] = useState(false);

  const {data: author} = useGetUserById(item.author);

  const handleLike = () => {
    setIsLiked(!isLiked);
    if (!isLiked) {
      setQuantityLikes(quantityLikes + 1);
    } else {
      setQuantityLikes(quantityLikes - 1);
    }
    likeOrDislikePost(item.id, user.id);
  };

  const handleComment = () => {
    setNeedReload(moment().unix());
    commentSheetRef.current?.present();
  };

  const handleOptions = () => {
    actionsSheetRef.current?.present();
  };

  const onShare = async () => {
    try {
      const result = await Share.share({
        message: item.description + '-' + item.files,
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

  const handleNavigateToProfile = () => {
    navigation.navigate('Profile', {id: item.author});
  };

  return (
    <>
      <View style={styles.container}>
        <AppBlock row>
          <LinearAvatar
            uri={author?.avatar}
            size={53}
            onPress={handleNavigateToProfile}
          />
          <AppBlock flex>
            <AppTouchableOpacity onPress={handleNavigateToProfile}>
              <AppText size={16} weight="800">
                {author?.firstName + ' ' + author?.lastName}
              </AppText>
            </AppTouchableOpacity>
            <AppBlock row alignItems="center">
              <AppText size={13} weight="500" style={{color: BLACK_80}} mr={4}>
                {moment(item.createdAt).locale('vi').fromNow(true)} •
              </AppText>
              <Icon2Users color={BLACK_80} />
            </AppBlock>
          </AppBlock>

          <AppTouchableOpacity
            width={24}
            height={24}
            style={AppStyles.center}
            onPress={handleOptions}>
            <Ionicons name="ellipsis-vertical" size={18} color={color.black} />
          </AppTouchableOpacity>
        </AppBlock>

        {item.description && (
          <Text style={styles.desc} numberOfLines={2}>
            {item.description}
          </Text>
        )}

        {item.files && size(item.files) > 0 && (
          <Pressable style={AppStyles.fill} onPress={() => setShowView(true)}>
            <View style={styles.dots}>
              {item.files.length > 1 ? (
                <View style={styles.blur}>
                  {item.files.map((_, index) => {
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
            </View>
            <MediaItem
              file={{
                uri: item.files[0].uri,
                name: item.files[0].name || '',
              }}
              style={styles.image}
              controls={false}
            />
          </Pressable>
        )}

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
          <TouchableOpacity style={AppStyles.rowCenter} onPress={onShare}>
            <IconShare width={20} />
            <Text style={styles.btnText}>Chia sẻ</Text>
          </TouchableOpacity>
        </AppBlock>
      </View>

      <ModalComment
        bottomRef={commentSheetRef}
        postId={item.id}
        needReload={needReload}
      />
      <ModalPostActions bottomRef={actionsSheetRef} item={item} />
      <ModalViewMedia
        data={item.files}
        isVisible={showView}
        onClose={() => setShowView(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  dots: {
    position: 'absolute',
    zIndex: 1,
    bottom: 0,
    left: 0,
    right: 0,
  },
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
    marginBottom: 12,
  },
});
