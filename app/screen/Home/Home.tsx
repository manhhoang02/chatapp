import React, {useCallback, useEffect, useRef, useState} from 'react';
import {StyleSheet} from 'react-native';
import AppConstant from '@abong.code/config/AppConstant';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {ParamsStack} from 'app/navigation/params';
import {ActivityIndicator} from 'react-native-paper';
import color from '@abong.code/theme/color';
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
import {addFcmToken} from 'app/api/auth';
import {showToastMessageError} from '@abong.code/helpers/messageHelper';
import AppContainer from 'app/components/Global/AppContainer';
import {KeyboardAwareFlatList} from 'react-native-keyboard-aware-scroll-view';
import HomeHeader from './container/Home.Header';
import {useRefresh} from 'app/hook/useRefresh';

let page = 1;

export default function () {
  // const {user} = useAppContext();
  const navigation = useNavigation<NativeStackNavigationProp<ParamsStack>>();
  const hasNextPage = useRef(false);
  const refOnEndReachedCalled = useRef(true);

  const currentList = useRef<Post[]>([]);

  const [posts, setPosts] = useState<Post[]>([]);

  const {data, isSuccess, isError, refetch} = useGetPosts(
    page,
    AppConstant.LIST_SIZE,
  );
  const onPressNotification = useCallback((params: ParamsStack['ChatView']) => {
    setTimeout(() => {
      navigation.navigate('ChatView', {
        chatId: JSON.parse(params.chatId),
        chatName: JSON.parse(params.chatName),
        friendId: JSON.parse(params.friendId),
        avatar: JSON.parse(params.avatar),
      });
    }, 2000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
          addFcmToken(token)
            .then()
            .catch(err => showToastMessageError('Lỗi', err.message));
        })
        .catch(err => console.log('Error get FcmToken', err.message));
    } else {
      addFcmToken(fcmToken)
        .then(res => consoleLog(res, 'res-api-addFcm'))
        .catch(err => showToastMessageError('Lỗi', err.message));
    }
  };

  const renderItem = ({item}: {item: Post}) => {
    return <ItemPost item={item} />;
  };

  const onRefreshing = () => {
    page = 1;
    onRefresh();
  };

  const onEndReached = () => {
    if (!refOnEndReachedCalled.current) {
      if (hasNextPage.current) {
        page++;
        hasNextPage.current = false;
      }
      refOnEndReachedCalled.current = true;
    }
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
      if (page === 1) {
        currentList.current = data;
      } else {
        currentList.current = [...currentList.current, ...data];
      }
      setPosts(currentList.current);
      hasNextPage.current = data.length > AppConstant.LIST_SIZE;
    } else if (isError) {
      hasNextPage.current = false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, data, isSuccess, isError]);

  const {isRefreshing, onRefresh} = useRefresh(refetch);

  return (
    <AppContainer>
      <KeyboardAwareFlatList
        refreshing={isRefreshing}
        onRefresh={onRefreshing}
        data={posts}
        keyExtractor={(_, index) => index.toString()}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        ListHeaderComponentStyle={styles.header}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.1}
        ListHeaderComponent={<HomeHeader />}
        ListFooterComponent={
          hasNextPage.current ? (
            <ActivityIndicator color={color.primary} />
          ) : null
        }
        onMomentumScrollBegin={() => {
          refOnEndReachedCalled.current = false;
        }}
        enableResetScrollToCoords={false}
      />
    </AppContainer>
  );
}
const styles = StyleSheet.create({
  header: {marginBottom: 8},
});
