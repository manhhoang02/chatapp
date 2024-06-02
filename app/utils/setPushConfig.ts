import {
  StreamVideoClient,
  StreamVideoRN,
} from '@stream-io/video-react-native-sdk';
import {AndroidImportance} from '@notifee/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {staticNavigate} from './staticNavigation';
import {chatApiKey} from 'app/components/chat/chatConfig';
import {chatClient} from 'app/hook/useChatClient';

export function setPushConfig() {
  StreamVideoRN.setPushConfig({
    ios: {
      pushProviderName: 'rn-apn-video',
    },
    android: {
      // add your push_provider_name for Android that you have setup in Stream dashboard
      pushProviderName: 'funchat',
      // configure the notification channel to be used for incoming calls for Android.
      callChannel: {
        id: 'stream_call_notifications',
        name: 'Call notifications',
        importance: AndroidImportance.HIGH,
        sound: 'default',
      },
      incomingCallChannel: {
        id: 'stream_incoming_call',
        name: 'Incoming call notifications',
        // This is the advised importance of receiving incoming call notifications.
        // This will ensure that the notification will appear on-top-of applications.
        importance: AndroidImportance.HIGH,
        // optional: if you dont pass a sound, default ringtone will be used
        sound: 'default',
      },
      // configure the functions to create the texts shown in the notification
      // for incoming calls in Android.
      incomingCallNotificationTextGetters: {
        getTitle: (createdUserName: string) =>
          `Bạn có cuộc gọi từ ${createdUserName}`,
        getBody: (_createdUserName: string) => 'Nhấn để trả lời cuộc gọi',
      },
    },
    // add the callback to be executed a call is accepted, used for navigation
    navigateAcceptCall: () => {
      staticNavigate({name: 'InCallScreen', params: undefined});
    },
    // add the callback to be executed when a notification is tapped,
    // but the user did not press accept or decline, used for navigation
    navigateToIncomingCall: () => {
      staticNavigate({name: 'InCallScreen', params: undefined});
    },
    // add the async callback to create a video client
    // for incoming calls in the background on a push notification
    createStreamVideoClient: async () => {
      // note that since the method is async,
      // you can call your server to get the user data or token or retrieve from offline storage.
      const userId = await AsyncStorage.getItem('id');
      const userName = await AsyncStorage.getItem('@userName');
      const userAvatar = await AsyncStorage.getItem('@userAvatar');
      if (!userId || !userName || !userAvatar) {
        return undefined;
      }
      // an example promise to fetch token from your server
      const apiKey = chatApiKey;
      const user = {
        id: userId,
        name: userName,
        image: userAvatar,
      };

      const token = chatClient.devToken(userId);
      return new StreamVideoClient({
        apiKey,
        user,
        token,
      });
    },
  });
}
