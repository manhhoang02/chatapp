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
  recentlyUserByIdListener,
  useAddFriend,
  useCancelRequestFriend,
  useSendRequestFriend,
} from 'app/api/auth';
import {useGetUserPosts} from 'app/api/post';
import {Post} from 'app/api/post.type';
import ItemPost from 'app/components/ItemPost';
import LinearAvatar from 'app/components/LinearAvatar';
import {useChatContext} from 'app/components/chat/ChatContext';
import ModalProfileActions from 'app/components/modals/ModalProfileActions';
import {chatClient} from 'app/hook/useChatClient';
import {ParamsStack} from 'app/navigation/params';
import useAuthStore from 'app/store/authStore';
import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import {View} from 'react-native';
import {shallow} from 'zustand/shallow';
import ProfileInfo from './container/Profile.Info';
import {useDataStore} from 'app/store/dataStore';
import {useRefresh} from 'app/hook/useRefresh';
import {consoleLog} from '@abong.code/helpers/logHelper';

export default function ({
  navigation,
  route,
}: NativeStackScreenProps<ParamsStack, 'Profile'>) {
  const [user, dispatchUser] = useAuthStore(
    s => [s.user, s.dispatchUser],
    shallow,
  );
  const {setChannel} = useChatContext();
  const userById = useDataStore(s => s.recentlyData.userById);

  consoleLog(userById, 'userById');
  const [showActions, setShowActions] = useState(false);
  const [avatar, setAvatar] = useState('');
  const [background, setBackground] = useState('');
  const [mode, setMode] = useState<'avatar' | 'background'>('avatar');

  useEffect(() => {
    const subscriber = recentlyUserByIdListener(route.params.id);
    return subscriber;
  }, [route.params.id]);

  const {
    data: p_data,
    isLoading: p_loading,
    refetch: p_refetch,
  } = useGetUserPosts({
    userId: route.params.id,
  });

  const isFriend = userById?.friends.includes(user.id);
  const isSentFriendReq = userById?.friend_requests.includes(user.id);
  const isFriendRequest = userById?.sent_friend_requests.includes(user.id);

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
    });
  };

  const handleChangeRelationship = () => {
    if (userById) {
      const params = {friendId: userById.id};

      if (!isFriend && !isSentFriendReq && !isFriendRequest) {
        sendR(params, {
          onSuccess,
          onError: () => {
            showToastMessageError('Không thể gửi lời mời');
          },
        });
      } else if (isFriendRequest) {
        acceptR(params, {
          onSuccess,
          onError: () => {
            showToastMessageError('Đã xảy ra lỗi');
          },
        });
      } else if (isSentFriendReq) {
        cancelR(params, {
          onSuccess,
          onError: () => {
            showToastMessageError('Đã xảy ra lỗi');
          },
        });
      }
    }
  };

  const handleSendMsg = async () => {
    if (userById) {
      const channel = chatClient.channel('messaging', {
        members: [user.id, userById.id],
        name: userById.firstName + ' ' + userById.lastName,
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
  if (isFriend) {
    label = 'Bạn bè';
  } else if (isFriendRequest) {
    label = 'Chấp nhận lời mời';
  } else if (isSentFriendReq) {
    label = 'Huỷ lời mời';
  } else {
    label = 'Thêm bạn bè';
  }

  const {isRefreshing, onRefresh} = useRefresh(p_refetch);

  if (p_loading) {
    // if (u_loading && p_loading) {
    return (
      <AppBlock flex center>
        <ActivityIndicator size={'large'} color={color.primary} />
      </AppBlock>
    );
  }

  return (
    <>
      <View style={styles.container}>
        <TouchableWithoutFeedback
          onPress={() => openModalActions('background')}>
          <Image
            source={
              background || userById?.background
                ? {uri: background || userById?.background}
                : require('assets/image/background.png')
            }
            style={styles.coverImage}
            resizeMode="contain"
          />
        </TouchableWithoutFeedback>

        <AppBlock flex ph={16}>
          <AppBlock alignItems="center">
            <LinearAvatar
              uri={avatar || userById?.avatar}
              size={120}
              onPress={() => openModalActions('avatar')}
              style={styles.avatar}
            />
            <Text style={styles.name}>
              {userById?.firstName + ' ' + userById?.lastName}
            </Text>
          </AppBlock>

          {userById?.id !== user.id && (
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
                disabled={!isFriend}
                style={[
                  styles.btn,
                  {backgroundColor: color.black006, marginLeft: appSize(20)},
                  !isFriend && styles.opacity0p5,
                ]}>
                <Text style={styles.textBtn}>Nhắn tin</Text>
              </TouchableOpacity>
            </View>
          )}

          <ProfileInfo item={userById!} />

          <Text style={styles.textPost}>Bài viết</Text>
          <View style={styles.container}>
            <FlatList
              refreshing={isRefreshing}
              onRefresh={onRefresh}
              data={p_data}
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
  opacity0p5: {opacity: 0.5},
  avatar: {marginTop: -80},
  textPost: {
    fontWeight: 'bold',
    color: color.black,
    fontSize: 16,
    marginVertical: appSize(10),
  },
  container: {
    flex: 1,
  },
  coverImage: {
    height: AppConstant.SCREEN_WIDTH * 0.5,
    width: AppConstant.SCREEN_WIDTH,
    backgroundColor: '#FFF',
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
