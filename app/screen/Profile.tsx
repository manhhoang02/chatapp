import AppConstant, {appSize} from '@abong.code/config/AppConstant';
import {useAppContext} from '@abong.code/context/AppProvider';
import {showToastMessageError} from '@abong.code/helpers/messageHelper';
import color from '@abong.code/theme/color';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {
  getProfileMe,
  useAddFriend,
  useGetProfileUser,
  useSendRequestFriend,
} from 'app/api/auth';
import {getChat, createChat} from 'app/api/chat';
import {useGetPostsProfile} from 'app/api/post';
import {Post} from 'app/api/post.type';
import ItemPost from 'app/components/ItemPost';
import ModalComment from 'app/components/modals/ModalComment';
import {ParamsStack} from 'app/navigation/params';
import React, {useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import {View} from 'react-native';
import {Modalize} from 'react-native-modalize';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function ({
  navigation,
  route,
}: NativeStackScreenProps<ParamsStack, 'Profile'>) {
  const {user, setUser, socket} = useAppContext();
  const {top} = useSafeAreaInsets();
  const noLoadMore = useRef(false);
  const prevData = useRef<Post[]>([]);
  const refreshing = useRef<boolean>(false);
  const scrollBegin = useRef(false);
  const [page, setPage] = useState(1);
  const [posts, setPosts] = useState<Post[]>([]);
  const [commentPostId, setCommentPostId] = useState('');
  const modalizeRef = useRef<Modalize>(null);

  const {data} = useGetProfileUser(route?.params?.id);
  const {
    data: postsData,
    isFetchedAfterMount,
    isError,
    isSuccess,
  } = useGetPostsProfile(route?.params?.id, page, AppConstant.LIST_SIZE);

  const isFriend = user.friends.some(i => i === data?._id);
  const isSentFriendReq = user.sent_friend_requests.some(i => i === data?._id);
  const isFriendRequest = user.friend_requests.some(i => i === data?._id);

  const {mutate: acceptFriend} = useAddFriend();
  const {mutate: sendRequestFriend} = useSendRequestFriend();

  const handleChangeRelationship = () => {
    if (!isFriend && !isSentFriendReq) {
      sendRequestFriend(data!._id, {
        onSuccess: () => {
          getProfileMe().then(res => {
            setUser({...user, ...res});
          });
          socket.emit('change-relationship', data!._id);
        },
        onError: () => {
          showToastMessageError('Lỗi', 'Đã xảy ra lỗi');
        },
      });
    }
    if (isFriendRequest) {
      acceptFriend(data!._id, {
        onSuccess: () => {
          getProfileMe().then(res => {
            setUser({...user, ...res});
          });
        },
        onError: () => {
          showToastMessageError('Lỗi', 'Đã xảy ra lỗi');
        },
      });
    }
  };

  const handleSendMsg = () => {
    getChat(user._id, data!._id)
      .then(res => {
        if (res) {
          navigation.navigate('ChatView', {
            chatId: res._id,
            chatName: data?.first_name + ' ' + data?.last_name,
            avatar: data!.avatar,
            friendId: data!._id,
          });
        } else {
          createChat(user._id, data!._id)
            .then(resp => {
              navigation.navigate('ChatView', {
                chatId: resp._id,
                chatName: data?.first_name + ' ' + data?.last_name,
                avatar: data!.avatar,
                friendId: data!._id,
              });
            })
            .catch();
        }
      })
      .catch();
  };
  const renderItem = ({item}: {item: Post}) => {
    console.log(item);
    return (
      <ItemPost
        {...item}
        modalizeRef={modalizeRef}
        setCommentPostId={setCommentPostId}
      />
    );
  };
  if (isFetchedAfterMount) {
    refreshing.current = false;
  }
  const onRefresh = () => {
    refreshing.current = true;
    setPage(1);
  };
  const onEndReached = () => {
    if (scrollBegin.current) {
      if (noLoadMore.current === false) {
        setPage(prev => prev + 1);
      }
      scrollBegin.current = false;
    }
  };
  useEffect(() => {
    if (isSuccess && postsData) {
      refreshing.current = false;
      if (page === 1) {
        prevData.current = postsData || [];
      } else {
        prevData.current = [...prevData.current, ...postsData];
      }
      setPosts(prevData.current);

      noLoadMore.current = postsData.length < AppConstant.LIST_SIZE;
    } else if (isError) {
      noLoadMore.current = true;
    }
  }, [page, postsData, isSuccess, isError]);

  useEffect(() => {
    socket.on('change-relationship', () => {
      getProfileMe().then(res => {
        setUser({...user, ...res});
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket, user]);

  return (
    <View style={[styles.container, {paddingTop: top}]}>
      <View style={[styles.header]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={color.black} />
        </TouchableOpacity>
      </View>
      <View style={styles.coverImage} />
      <View style={styles.boxAvatar}>
        <Image
          source={
            data?.avatar
              ? {uri: data?.avatar}
              : require('assets/image/profile.png')
          }
          style={styles.avatar}
          resizeMode="contain"
        />
      </View>
      <View style={{paddingHorizontal: appSize(16), flex: 1}}>
        <Text style={styles.name}>
          {data?.first_name + ' ' + data?.last_name}
        </Text>
        {data?._id !== user._id && (
          <View style={styles.containerBtn}>
            <TouchableOpacity
              onPress={handleChangeRelationship}
              style={[styles.btn, {backgroundColor: color.primary}]}>
              {isFriend && (
                <Text style={[styles.textBtn, {color: color.white}]}>
                  Bạn bè
                </Text>
              )}
              {isFriendRequest && (
                <Text style={[styles.textBtn, {color: color.white}]}>
                  Trả lời
                </Text>
              )}
              {isSentFriendReq ? (
                <Text style={[styles.textBtn, {color: color.white}]}>
                  Huỷ lời mời
                </Text>
              ) : (
                !isFriend && (
                  <Text style={[styles.textBtn, {color: color.white}]}>
                    Thêm bạn bè
                  </Text>
                )
              )}
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleSendMsg}
              style={[
                styles.btn,
                {backgroundColor: color.black006, marginLeft: appSize(20)},
              ]}>
              <Text style={styles.textBtn}>Nhắn tin</Text>
            </TouchableOpacity>
          </View>
        )}
        <Text
          style={{
            fontWeight: 'bold',
            color: color.black,
            marginVertical: appSize(10),
          }}>
          Bài viết
        </Text>
        <View style={styles.container}>
          <FlatList
            refreshing={refreshing.current}
            onRefresh={onRefresh}
            data={posts}
            keyExtractor={(_, index) => index.toString()}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom: appSize(10),
            }}
            onEndReached={onEndReached}
            onEndReachedThreshold={0.1}
            ListFooterComponent={
              noLoadMore.current ? null : (
                <ActivityIndicator color={color.primary} />
              )
            }
            onMomentumScrollBegin={() => {
              scrollBegin.current = true;
            }}
          />
        </View>
      </View>
      <ModalComment modalizeRef={modalizeRef} commentPostId={commentPostId} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    paddingHorizontal: appSize(16),
  },
  coverImage: {
    height: appSize(200),
    backgroundColor: color.disabled,
    marginTop: appSize(10),
  },
  boxAvatar: {
    width: appSize(120),
    height: appSize(120),
    marginTop: appSize(-80),
    marginLeft: appSize(16),
    borderRadius: appSize(120),
  },
  avatar: {
    borderWidth: appSize(3),
    width: appSize(120),
    height: appSize(120),
    borderRadius: appSize(120),
    borderColor: color.white,
    backgroundColor: color.white,
  },
  name: {
    fontSize: appSize(18),
    fontWeight: 'bold',
    marginTop: appSize(10),
    color: color.black,
  },
  containerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: appSize(15),
    alignSelf: 'center',
    marginTop: appSize(10),
    borderBottomWidth: appSize(1),
    borderColor: color.placeholder,
  },
  btn: {
    flex: 1,
    paddingVertical: appSize(8),
    borderRadius: appSize(5),
    alignItems: 'center',
    justifyContent: 'center',
  },
  textBtn: {
    fontWeight: '600',
    color: color.black,
  },
});
