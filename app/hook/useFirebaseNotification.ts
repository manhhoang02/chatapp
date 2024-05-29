import messaging, {
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';
import {useEffect} from 'react';
import {PermissionsAndroid} from 'react-native';
import notifee, {
  AndroidImportance,
  Event,
  EventType,
} from '@notifee/react-native';

async function requestUserPermission() {
  PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    const fcmToken = await messaging().getToken();
    console.log('FCM Token:', fcmToken);
    console.log('Authorization status:', authStatus);
  }
}

export const displayNotification = async (
  message: FirebaseMessagingTypes.RemoteMessage,
) => {
  // Display a notification
  await notifee.displayNotification({
    title: message.notification?.title,
    body: message.notification?.body,
    android: {
      channelId: 'fun-chat-channel',
      importance: AndroidImportance.HIGH,
    },
  });
};

export const handlePushEvent = async (event: Event) => {
  const {type, detail} = event;
  switch (type) {
    case EventType.PRESS: {
      // your logic here
      console.log('hehehe', detail.notification?.id);
      break;
    }
    default:
      break;
  }
};

export default function useFirebaseNotification() {
  // Background message handler
  // messaging().setBackgroundMessageHandler(displayNotification);

  // Listen to background notification events
  // notifee.onBackgroundEvent(handlePushEvent);

  useEffect(() => {
    requestUserPermission();

    async function createChannel() {
      await notifee.createChannel({
        id: 'fun-chat-channel',
        name: 'FunChat Channel',
        importance: AndroidImportance.HIGH,
      });
    }

    createChannel();

    const unsubscribe = messaging().onMessage(displayNotification);

    return unsubscribe;
  }, []);
}
