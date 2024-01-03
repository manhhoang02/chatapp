import {appSize} from '@abong.code/config/AppConstant';
import {useAppContext} from '@abong.code/context/AppProvider';
import color from '@abong.code/theme/color';
import {likeOrDislikePost} from 'app/api/post';
import {Post} from 'app/api/post.type';
import moment from 'moment';
import React, {useState} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {IHandles} from 'react-native-modalize/lib/options';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Video from 'react-native-video';

interface Props extends Post {
  modalizeRef: React.RefObject<IHandles>;
  setCommentPostId: Function;
}
export default function (props: Props) {
  const {user} = useAppContext();
  const [isLike, setIsLike] = useState(
    props.users_liked.some(e => e === user._id),
  );
  const [quantityLikes, setQuantityLikes] = useState(
    props.users_liked.length || 0,
  );
  const handleLike = () => {
    if (!isLike) {
      setQuantityLikes(quantityLikes + 1);
    } else {
      setQuantityLikes(quantityLikes - 1);
    }
    setIsLike(!isLike);
    likeOrDislikePost(props._id);
  };
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={
            props.author.avatar
              ? {uri: props.author.avatar}
              : require('assets/image/profile.png')
          }
          style={{
            width: appSize(35),
            height: appSize(35),
            marginRight: appSize(10),
            borderRadius: appSize(35),
          }}
          resizeMode="contain"
        />
        <View>
          <Text style={styles.textName}>
            {props.author.first_name + ' ' + props.author.last_name}
          </Text>
          <Text style={styles.textTime}>
            {moment(props.createdAt).fromNow()}
          </Text>
        </View>
      </View>
      <Text style={{marginBottom: appSize(5), color: color.black}}>
        {props.description}
      </Text>
      {props.files.length > 0 && (
        <View style={{marginHorizontal: appSize(-10)}}>
          {props.files[0].includes('.jpg') ||
          props.files[0].includes('.png') ? (
            <Image
              source={{uri: props.files[0]}}
              style={{
                // width: '100%',
                height: appSize(200),
                marginHorizontal: appSize(-10),
              }}
              resizeMode="contain"
            />
          ) : (
            <Video
              controls={true}
              source={{
                uri: props.files[0],
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
      <View style={[styles.row, {paddingVertical: appSize(8)}]}>
        {quantityLikes !== 0 && (
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
        )}
        <View style={styles.flex} />
        {props.total_comments !== 0 && (
          <Text style={styles.textQuantity}>
            {props.total_comments} bình luận
          </Text>
        )}
      </View>
      <View style={styles.contentAction}>
        <TouchableOpacity style={styles.btn} onPress={handleLike}>
          {isLike ? (
            <AntDesign name="like1" size={appSize(20)} color={color.primary} />
          ) : (
            <AntDesign
              name="like2"
              size={appSize(20)}
              color={color.textBtnLike}
            />
          )}
          <Text
            style={[
              styles.textBtn,
              {
                color: isLike ? color.primary : color.textBtnLike,
              },
            ]}>
            Thích
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.btn}
          onPress={() => {
            props.modalizeRef.current?.open();
            props.setCommentPostId(props._id);
          }}>
          <MaterialCommunityIcons
            name="comment-outline"
            size={appSize(20)}
            color={color.textBtnLike}
          />
          <Text style={styles.textBtn}>Bình luận</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: appSize(15),
    shadowColor: color.black,
    shadowOffset: {
      width: 0,
      height: 0.8,
    },
    shadowOpacity: 0.25,
    shadowRadius: 2,
    elevation: 5,
    borderRadius: appSize(10),
    backgroundColor: color.white,
    paddingHorizontal: appSize(10),
    paddingTop: appSize(10),
    marginHorizontal: appSize(1),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: appSize(10),
  },
  textName: {
    fontWeight: '600',
    color: color.black,
  },
  textTime: {
    fontSize: appSize(12),
    color: color.black04,
  },
  contentAction: {
    flexDirection: 'row',
    borderTopWidth: appSize(1),
    borderColor: color.border,
  },
  btn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: appSize(8),
    justifyContent: 'center',
    marginHorizontal: appSize(10),
  },
  textBtn: {
    color: color.textBtnLike,
    marginLeft: appSize(5),
    fontWeight: '500',
  },
  contentQuantity: {
    flexDirection: 'row',
    alignItems: 'center',
    // marginVertical: appSize(8),
  },
  textQuantity: {
    marginLeft: appSize(5),
    color: color.textBtnLike,
  },
  row: {flexDirection: 'row'},
  flex: {flex: 1},
});
