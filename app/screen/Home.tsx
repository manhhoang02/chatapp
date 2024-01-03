import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  FlatList,
  Pressable,
} from 'react-native';
import {useAppContext} from '@abong.code/context/AppProvider';
import Header from 'app/components/Header';
import AppConstant, {appSize} from '@abong.code/config/AppConstant';
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
import moment from 'moment';
import ModalCreatePost from 'app/components/modals/ModalCreatePost';
import ModalComment from 'app/components/modals/ModalComment';
import {Modalize} from 'react-native-modalize';

export default function () {
  const {user} = useAppContext();
  const navigation = useNavigation<NativeStackNavigationProp<ParamsStack>>();
  const noLoadMore = useRef(false);
  const prevData = useRef<Post[]>([]);
  const refreshing = useRef<boolean>(false);
  const scrollBegin = useRef(false);
  const modalizeRef = useRef<Modalize>(null);

  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [dataMount, setDataMount] = useState(false); // check data đã đc mount vào flatlist hay chưa
  const [reload, setReload] = useState(0);
  const [showModalCreatePost, setShowModalCreatePost] = useState(false);
  const [commentPostId, setCommentPostId] = useState('');

  const {data, isSuccess, isError, isFetchedAfterMount} = useGetPosts(
    page,
    AppConstant.LIST_SIZE,
    reload,
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
    return (
      <ItemPost
        {...item}
        modalizeRef={modalizeRef}
        setCommentPostId={setCommentPostId}
      />
    );
  };
  const ListEmptyComponent =
    isFetchedAfterMount && dataMount ? (
      <View>
        <Text style={styles.titleEmptyFlatlist}>Không có bài viết mới.</Text>
      </View>
    ) : null;

  const ListHeaderComponent = (
    <TouchableOpacity
      style={styles.headerFlatList}
      onPress={() => setShowModalCreatePost(true)}>
      <Image
        source={
          user.avatar ? {uri: user.avatar} : require('assets/image/profile.png')
        }
        style={{
          width: appSize(40),
          height: appSize(40),
          borderRadius: appSize(40),
        }}
        resizeMode={'contain'}
      />
      <View
        style={[
          styles.flex,
          {
            backgroundColor: color.border,
            paddingVertical: appSize(10),
            paddingHorizontal: appSize(15),
            borderRadius: appSize(100),
            marginHorizontal: appSize(10),
          },
        ]}>
        <Text style={{color: color.black}}>Bạn đang nghĩ gì?</Text>
      </View>
      <Image
        source={require('assets/image/image.png')}
        style={{
          width: appSize(30),
          height: appSize(30),
        }}
        resizeMode={'contain'}
      />
    </TouchableOpacity>
  );

  if (isFetchedAfterMount) {
    refreshing.current = false;
  }
  const onRefresh = () => {
    refreshing.current = true;
    setDataMount(false);
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
  const left = (
    <Pressable onPress={() => setReload(moment().unix())}>
      <Image
        source={require('assets/image/logo_app.png')}
        style={styles.logo}
        resizeMode={'contain'}
      />
    </Pressable>
  );

  useEffect(() => {
    requestUserPermission()
      .then(res => {
        res && handleGetFcmToken();
      })
      .catch(err => console.log('Error request permission', err.message));
    modalizeRef.current?.close();
  }, []);

  useEffect(() => {
    if (isSuccess && data) {
      refreshing.current = false;
      if (page === 1) {
        prevData.current = data || [];
      } else {
        prevData.current = [...prevData.current, ...data];
      }
      setPosts(prevData.current);
      setDataMount(true);
      noLoadMore.current = data.length < AppConstant.LIST_SIZE;
    } else if (isError) {
      noLoadMore.current = true;
    }
  }, [page, data, isSuccess, isError]);
  return (
    <View
      style={[
        styles.flex,
        {backgroundColor: color.white, paddingHorizontal: appSize(16)},
      ]}>
      <FlatList
        refreshing={refreshing.current}
        onRefresh={onRefresh}
        data={posts}
        keyExtractor={(_, index) => index.toString()}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: appSize(100),
          paddingBottom: appSize(90),
        }}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.1}
        ListEmptyComponent={ListEmptyComponent}
        ListHeaderComponent={ListHeaderComponent}
        ListFooterComponent={
          noLoadMore.current ? null : (
            <ActivityIndicator color={color.primary} />
          )
        }
        onMomentumScrollBegin={() => {
          scrollBegin.current = true;
        }}
      />
      <Header left={left} />
      <ModalCreatePost
        isVisible={showModalCreatePost}
        onClose={() => {
          setShowModalCreatePost(false);
          setReload(moment().unix());
        }}
      />

      <ModalComment modalizeRef={modalizeRef} commentPostId={commentPostId} />
    </View>
  );
}
const styles = StyleSheet.create({
  flex: {flex: 1},
  logo: {
    width: appSize(140),
    height: appSize(70),
  },
  titleEmptyFlatlist: {
    textAlign: 'center',
    fontSize: appSize(16),
  },
  headerFlatList: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
