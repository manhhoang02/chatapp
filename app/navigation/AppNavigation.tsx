import {useAppContext} from '@abong.code/context/AppProvider';
import React, {useEffect, useState} from 'react';
import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppConstant, {appSize} from '@abong.code/config/AppConstant';
import {getProfileMe} from 'app/api/auth';
import {StyleSheet, View} from 'react-native';
import {ActivityIndicator} from 'react-native-paper';
import color from '@abong.code/theme/color';
import {NavigationContainer} from '@react-navigation/native';
import {initApiHeader} from '@abong.code/api/AppNetworking';
import ModalCallVideo from 'app/components/modals/ModalCallVideo';
import {consoleLog} from '@abong.code/helpers/logHelper';

export default function () {
  const {socket, user, setUser, showModalCallVideo, setShowModalCallVideo} =
    useAppContext();
  const [isLoading, setIsLoading] = useState(true);
  const [dataCall, setDataCall] = useState<any>();
  const init = async () => {
    const token = await AsyncStorage.getItem(AppConstant.SESSION.TOKEN);
    if (token) {
      initApiHeader(token);
      getProfileMe()
        .then(res => {
          setUser({...res, token});
          setIsLoading(false);
        })
        .catch(() => {
          initApiHeader();
          setIsLoading(false);
        });
    } else {
      initApiHeader();
      setIsLoading(false);
    }
  };
  useEffect(() => {
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
  consoleLog(dataCall);
  return (
    <NavigationContainer>
      {user._id ? <MainNavigator /> : <AuthNavigator />}
      {dataCall ? (
        dataCall.friendId === user._id ? (
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
        dataCall.friendId !== user._id ? (
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
