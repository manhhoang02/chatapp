import React, {useCallback, useEffect, useRef, useState} from 'react';
import {StyleSheet} from 'react-native';
import AppConstant from '@abong.code/config/AppConstant';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {ParamsStack} from 'app/navigation/params';
import {useGetPosts} from 'app/api/post';
import {Post} from 'app/api/post.type';
import ItemPost from 'app/components/ItemPost';
import {
  getFcmToken,
  getInitialNotification,
  onNotificationOpenedApp,
  requestUserPermission,
} from '@abong.code/config/FirebaseConfig';
import {consoleLog} from '@abong.code/helpers/logHelper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppContainer from 'app/components/Global/AppContainer';
import {KeyboardAwareFlatList} from 'react-native-keyboard-aware-scroll-view';
import HomeHeader from './container/Home.Header';
import {useRefresh} from 'app/hook/useRefresh';
import {useHomeStore} from 'app/store/homeStore';
import useAuthStore from 'app/store/authStore';

export default function () {
  const user = useAuthStore(s => s.user);

  const navigation = useNavigation<NativeStackNavigationProp<ParamsStack>>();

  const sync = useHomeStore(s => s.sync);

  const currentList = useRef<Post[]>([]);

  const [posts, setPosts] = useState<Post[]>([]);

  const {data, isSuccess, isError, refetch} = useGetPosts({
    reload: sync.post || sync.friend,
    userId: user.id,
  });

  const onPressNotification = useCallback(
    (params: ParamsStack['ChannelScreen']) => {
      // setTimeout(() => {
      //   navigation.navigate('ChatView', {
      //     chatId: JSON.parse(params.chatId),
      //     chatName: JSON.parse(params.chatName),
      //     friendId: JSON.parse(params.friendId),
      //     avatar: JSON.parse(params.avatar),
      //   });
      // }, 2000);
      consoleLog(params, 'params');
    },
    [],
  );

  useEffect(() => {
    getInitialNotification(e => onPressNotification(e));
    onNotificationOpenedApp(e => onPressNotification(e));
  }, [onPressNotification]);

  const handleGetFcmToken = async () => {
    const fcmToken = await AsyncStorage.getItem(AppConstant.SESSION.FCM_TOKEN);
    consoleLog(fcmToken);
    if (!fcmToken) {
      getFcmToken()
        .then(token => {
          AsyncStorage.setItem(AppConstant.SESSION.FCM_TOKEN, token);
        })
        .catch(err => {
          // showToastMessageError('Lỗi', err.message);
          console.log(err);
        });
    } else {
    }
  };

  const renderItem = ({item}: {item: Post}) => {
    return <ItemPost item={item} />;
  };

  useEffect(() => {
    requestUserPermission()
      .then(res => {
        res && handleGetFcmToken();
      })
      .catch(err => console.log('Error request permission', err.message));
  }, []);

  useEffect(() => {
    if (isSuccess && data) {
      currentList.current = data;
      setPosts(currentList.current);
    }
  }, [data, isSuccess, isError]);

  const {isRefreshing, onRefresh} = useRefresh(refetch);

  return (
    <AppContainer>
      <KeyboardAwareFlatList
        refreshing={isRefreshing}
        onRefresh={onRefresh}
        data={posts}
        keyExtractor={(_, index) => index.toString()}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        ListHeaderComponentStyle={styles.header}
        ListHeaderComponent={<HomeHeader />}
      />
    </AppContainer>
  );
}
const styles = StyleSheet.create({
  header: {marginBottom: 8},
});
