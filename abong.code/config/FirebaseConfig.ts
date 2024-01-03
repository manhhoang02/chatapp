import {consoleLog} from '@abong.code/helpers/logHelper';
import messaging, {
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';
import {Alert, Platform} from 'react-native';

export async function requestUserPermission() {
  if (Platform.OS === 'ios') {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (!enabled) {
      return false;
    } else {
      console.log('Authorization status:', authStatus);
    }
  }
  return true;
  // if (Platform.OS === 'android') {
  //   const res = await PermissionsAndroid.request(
  //     PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
  //   );
  //   console.log(res, 'statuss');
  // }
}

export async function getFcmToken() {
  // if (Platform.OS === 'ios') {
  //   await messaging().registerDeviceForRemoteMessages();
  // }
  return messaging().getToken();
}

export function onForegroundMessage() {
  return messaging().onMessage(async remoteMessage => {
    consoleLog(remoteMessage.notification, 'onForegroundMessage');
    if (remoteMessage.notification) {
      Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
    }
  });
}

//on background mode
// export function onNotificationOpenedApp(
//   onPress: (data: FirebaseMessagingTypes.RemoteMessage['data']) => void,
// ) {
//   // Assume a message-notification contains a "type" property in the data payload of the screen to open
//   messaging().onNotificationOpenedApp(remoteMessage => {
//     // console.log(
//     //   'Notification caused app to open from background state:',
//     //   remoteMessage.notification,
//     // );
//     consoleLog(remoteMessage.notification, 'onNotificationOpenedApp');
//     consoleLog(remoteMessage.data, 'dataMes');
//     onPress(remoteMessage.data);
//   });
// }

//on quit mode
export function getInitialNotification(
  onPress: (data: FirebaseMessagingTypes.RemoteMessage['data']) => void,
) {
  // Check whether an initial notification is available
  messaging()
    .getInitialNotification()
    .then(remoteMessage => {
      if (remoteMessage) {
        // console.log(
        //   'Notification caused app to open from quit state:',
        //   remoteMessage.notification,
        // );
        consoleLog(remoteMessage.notification, 'getInitialNotification');
        consoleLog(remoteMessage.data, 'dataMes');
        onPress(remoteMessage.data);
        // setInitialRoute(remoteMessage.data.type); // e.g. "Settings"
      }
    });
}

export const onNotificationOpenedApp = async (
  onPress: (data: FirebaseMessagingTypes.RemoteMessage['data']) => void,
) => {
  messaging().setBackgroundMessageHandler(async remoteMessage => {
    consoleLog('Message handled in the background!', remoteMessage);
    onPress(remoteMessage.data);
  });
};
