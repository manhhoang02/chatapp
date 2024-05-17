import {appSize} from '@abong.code/config/AppConstant';
import {
  showToastMessageError,
  showToastMessageSuccess,
} from '@abong.code/helpers/messageHelper';
import color from '@abong.code/theme/color';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {
  getUserById,
  useAddFriend,
  useCancelRequestFriend,
  useGetUserById,
  useSendRequestFriend,
} from 'app/api/auth';
import {getChat, createChat} from 'app/api/chat';
import {useGetUserPosts} from 'app/api/post';
import {Post} from 'app/api/post.type';
import ItemPost from 'app/components/ItemPost';
import LinearAvatar from 'app/components/LinearAvatar';
import {useRefresh} from 'app/hook/useRefresh';
import {ParamsStack} from 'app/navigation/params';
import useAuthStore from 'app/store/authStore';
import {useHomeStore} from 'app/store/homeStore';
import moment from 'moment';
import React from 'react';
import {FlatList, StyleSheet, Text, TouchableOpacity} from 'react-native';
import {View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function ({
  navigation,
  route,
}: NativeStackScreenProps<ParamsStack, 'Profile'>) {
  const {user, dispatchUser} = useAuthStore();
  const dispatchSync = useHomeStore(s => s.dispatchSync);
  const {top} = useSafeAreaInsets();

  const {data, refetch} = useGetUserById(route.params.id);
  const {data: userPosts} = useGetUserPosts({userId: route.params.id});

  const isFriend = user.friends.some(i => i === data?.id);
  const isSentFriendReq = user.sent_friend_requests.some(i => i === data?.id);
  const isFriendRequest = user.friend_requests.some(i => i === data?.id);

  const {mutate: acceptR} = useAddFriend();
  const {mutate: sendR} = useSendRequestFriend();
  const {mutate: cancelR} = useCancelRequestFriend();

  const onSuccess = (response: {message: string}) => {
    showToastMessageSuccess('Thành công', response.message);
    getUserById(user.id).then(res => {
      dispatchUser({...user, ...res});
      refetch();
    });
    dispatchSync({friend: moment().unix()});
  };

  const handleChangeRelationship = () => {
    if (data) {
      const params = {friendId: data.id, userId: user.id};

      if (!isFriend && !isSentFriendReq) {
        sendR(params, {
          onSuccess,
          onError: () => {
            showToastMessageError('Thất bại', 'Không thể gửi lời mời');
          },
        });
      } else if (isFriendRequest) {
        acceptR(params, {
          onSuccess,
          onError: () => {
            showToastMessageError('Lỗi', 'Đã xảy ra lỗi');
          },
        });
      } else {
        cancelR(params, {
          onSuccess,
          onError: () => {
            showToastMessageError('Lỗi', 'Đã xảy ra lỗi');
          },
        });
      }
    }
  };

  const handleSendMsg = () => {
    getChat(user.id, data!.id)
      .then(res => {
        if (res) {
          navigation.navigate('ChatView', {
            chatId: res._id,
            chatName: data?.firstName + ' ' + data?.lastName,
            avatar: data!.avatar,
            friendId: data!.id,
          });
        } else {
          createChat(user.id, data!.id)
            .then(resp => {
              navigation.navigate('ChatView', {
                chatId: resp._id,
                chatName: data?.firstName + ' ' + data?.lastName,
                avatar: data!.avatar,
                friendId: data!.id,
              });
            })
            .catch();
        }
      })
      .catch();
  };
  const renderItem = ({item}: {item: Post}) => {
    return <ItemPost item={item} />;
  };

  let label = '';
  switch (true) {
    case isFriend:
      label = 'Bạn bè';
      break;
    case isFriendRequest:
      label = 'Chấp nhận lời mời';
      break;
    case isSentFriendReq:
      label = 'Huỷ lời mời';
      break;
    default:
      label = 'Thêm bạn bè';
      break;
  }

  const {isRefreshing, onRefresh} = useRefresh(refetch);

  return (
    <View style={[styles.container, {paddingTop: top}]}>
      <View style={[styles.header]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={color.black} />
        </TouchableOpacity>
      </View>
      <View style={styles.coverImage} />

      <LinearAvatar
        uri={data?.avatar}
        size={120}
        disabled
        style={{marginTop: -80, marginLeft: 16}}
      />
      <View style={{paddingHorizontal: appSize(16), flex: 1}}>
        <Text style={styles.name}>{user.firstName + ' ' + user.lastName}</Text>
        {data?.id !== user.id && (
          <View style={styles.containerBtn}>
            <TouchableOpacity
              onPress={handleChangeRelationship}
              style={[styles.btn, {backgroundColor: color.primary}]}>
              <Text style={[styles.textBtn, {color: color.white}]}>
                {label}
              </Text>
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
            fontSize: 16,
            marginVertical: appSize(10),
          }}>
          Bài viết
        </Text>
        <View style={styles.container}>
          <FlatList
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            data={userPosts}
            keyExtractor={(_, index) => index.toString()}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom: appSize(10),
            }}
          />
        </View>
      </View>
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
  name: {
    fontSize: appSize(18),
    fontWeight: 'bold',
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
