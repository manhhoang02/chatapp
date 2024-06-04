import AppConstant, {appSize} from '@abong.code/config/AppConstant';
import {
  showToastMessageError,
  showToastMessageSuccess,
} from '@abong.code/helpers/messageHelper';
import color from '@abong.code/theme/color';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AppBlock} from '@starlingtech/element';
import {
  getUserById,
  useAddFriend,
  useCancelRequestFriend,
  useGetUserById,
  useSendRequestFriend,
} from 'app/api/auth';
import {useGetUserPosts} from 'app/api/post';
import {Post} from 'app/api/post.type';
import ItemPost from 'app/components/ItemPost';
import LinearAvatar from 'app/components/LinearAvatar';
import {useChatContext} from 'app/components/chat/ChatContext';
import ModalProfileActions from 'app/components/modals/ModalProfileActions';
import {chatClient} from 'app/hook/useChatClient';
import {useRefresh} from 'app/hook/useRefresh';
import {ParamsStack} from 'app/navigation/params';
import useAuthStore from 'app/store/authStore';
import {useHomeStore} from 'app/store/homeStore';
import moment from 'moment';
import React, {useState} from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import {View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {shallow} from 'zustand/shallow';

export default function ({
  navigation,
  route,
}: NativeStackScreenProps<ParamsStack, 'Profile'>) {
  const [user, dispatchUser] = useAuthStore(
    s => [s.user, s.dispatchUser],
    shallow,
  );
  const [dispatchSync, sync] = useHomeStore(
    s => [s.dispatchSync, s.sync],
    shallow,
  );
  const {top} = useSafeAreaInsets();
  const {setChannel} = useChatContext();

  const [showActions, setShowActions] = useState(false);
  const [avatar, setAvatar] = useState('');
  const [background, setBackground] = useState('');
  const [mode, setMode] = useState<'avatar' | 'background'>('avatar');

  const {data, refetch} = useGetUserById(route.params.id, sync.profile);
  const {data: userPosts} = useGetUserPosts({userId: route.params.id});

  const isFriend = user.friends.some(i => i === data?.id);
  const isSentFriendReq = user.sent_friend_requests.some(i => i === data?.id);
  const isFriendRequest = user.friend_requests.some(i => i === data?.id);

  const {mutate: acceptR} = useAddFriend();
  const {mutate: sendR} = useSendRequestFriend();
  const {mutate: cancelR} = useCancelRequestFriend();

  const onSetImage = (uri: string) => {
    if (mode === 'avatar') {
      setAvatar(uri);
    } else {
      setBackground(uri);
    }
  };

  const onSuccess = (response: any) => {
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

  const handleSendMsg = async () => {
    if (data) {
      if (!isFriend) {
        showToastMessageError('Lỗi', 'Bạn cần kết bạn trước khi nhắn tin');
        return;
      }
      const channel = chatClient.channel('messaging', {
        members: [user.id, data.id],
        name: data.firstName + ' ' + data.lastName,
      });

      setChannel(channel);
      navigation.navigate('ChannelScreen');
    }
  };

  const openModalActions = (_mode: 'avatar' | 'background') => {
    setMode(_mode);
    setShowActions(true);
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
    <>
      <View style={[styles.container, {paddingTop: top}]}>
        <View style={[styles.header]}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={24} color={color.black} />
          </TouchableOpacity>
        </View>
        <TouchableWithoutFeedback
          onPress={() => openModalActions('background')}>
          <Image
            source={
              background || data?.background
                ? {uri: background || data?.background}
                : require('assets/image/background.png')
            }
            style={styles.coverImage}
            resizeMode="contain"
          />
        </TouchableWithoutFeedback>

        <LinearAvatar
          uri={avatar || data?.avatar}
          size={120}
          onPress={() => openModalActions('avatar')}
          style={styles.avatar}
        />
        <AppBlock flex ph={16}>
          <Text style={styles.name}>
            {data?.firstName + ' ' + data?.lastName}
          </Text>
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
          <Text style={styles.textPost}>Bài viết</Text>
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
        </AppBlock>
      </View>

      <ModalProfileActions
        userId={route.params.id}
        mode={mode}
        isVisible={showActions}
        onClose={() => setShowActions(false)}
        setImage={onSetImage}
      />
    </>
  );
}

const styles = StyleSheet.create({
  avatar: {marginTop: -80, marginLeft: 16},
  textPost: {
    fontWeight: 'bold',
    color: color.black,
    fontSize: 16,
    marginVertical: appSize(10),
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    paddingHorizontal: appSize(16),
  },
  coverImage: {
    height: AppConstant.SCREEN_WIDTH * 0.5,
    width: AppConstant.SCREEN_WIDTH,
    backgroundColor: '#FFF',
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
