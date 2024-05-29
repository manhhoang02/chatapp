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
import useAuthStore from 'app/store/authStore';
import {shallow} from 'zustand/shallow';
import {ChatProvider} from 'app/components/chat/ChatContext';
import {useChatClient} from 'app/hook/useChatClient';
import useFirebaseNotification from 'app/hook/useFirebaseNotification';
import messaging from '@react-native-firebase/messaging';

export default function () {
  const [user, dispatchUser] = useAuthStore(
    s => [s.user, s.dispatchUser],
    shallow,
  );

  const [isLoading, setIsLoading] = useState(false);

  const init = async () => {
    const uid = await AsyncStorage.getItem('id');
    if (uid) {
      const resUser = await getUserById(uid);
      if (resUser) {
        dispatchUser({
          ...resUser,
        });
        // AsyncStorage.setItem('id', resUser.id);
      }
      messaging()
        .subscribeToTopic(uid)
        .then(() => console.log('Subscribed to topic: ' + uid));
    } else {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useChatClient();
  useFirebaseNotification();

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
