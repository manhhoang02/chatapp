import {useAppContext} from '@abong.code/context/AppProvider';
import React, {useEffect, useState} from 'react';
import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {appSize} from '@abong.code/config/AppConstant';
import {getUserById} from 'app/api/auth';
import {StyleSheet, View} from 'react-native';
import {ActivityIndicator} from 'react-native-paper';
import color from '@abong.code/theme/color';
import {NavigationContainer} from '@react-navigation/native';
import ModalCallVideo from 'app/components/modals/ModalCallVideo';
import useAuthStore from 'app/store/authStore';
import {shallow} from 'zustand/shallow';
import {ChatProvider} from 'app/components/chat/ChatContext';
import {useChatClient} from 'app/hook/useChatClient';

export default function () {
  const {socket, showModalCallVideo, setShowModalCallVideo} = useAppContext();

  useChatClient();

  const [user, dispatchUser] = useAuthStore(
    s => [s.user, s.dispatchUser],
    shallow,
  );

  const [isLoading, setIsLoading] = useState(false);
  const [dataCall, setDataCall] = useState<any>();

  const init = async () => {
    const uid = await AsyncStorage.getItem('id');
    if (uid) {
      const resUser = await getUserById(uid);
      if (resUser) {
        dispatchUser({
          ...resUser,
        });
        AsyncStorage.setItem('id', resUser.id);
      }
    } else {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (user.id) {
      setIsLoading(false);
    }
  }, [user.id]);

  useEffect(() => {
    socket.on('call', data => {
      setDataCall(data);
      setShowModalCallVideo(true);
    });
    socket.on('call-cancel', () => {
      setDataCall(null);
      setShowModalCallVideo(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket]);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator color={color.primary} animating size={appSize(30)} />
      </View>
    );
  }

  return (
    <ChatProvider>
      <NavigationContainer>
        {user.id ? <MainNavigator /> : <AuthNavigator />}
        {dataCall ? (
          dataCall.friendId === user.id ? (
            <ModalCallVideo
              callerId={dataCall.userId}
              calleeId={dataCall.friendId}
              name={dataCall.nameCaller}
              avatar={dataCall.avatarCaller}
              isVisible={showModalCallVideo}
              onClose={() => setShowModalCallVideo(false)}
            />
          ) : null
        ) : null}
        {dataCall ? (
          dataCall.friendId !== user.id ? (
            <ModalCallVideo
              callerId={dataCall.userId}
              calleeId={dataCall.friendId}
              name={dataCall.nameCallee}
              avatar={dataCall.avatarCallee}
              isVisible={showModalCallVideo}
              onClose={() => setShowModalCallVideo(false)}
            />
          ) : null
        ) : null}
      </NavigationContainer>
    </ChatProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
