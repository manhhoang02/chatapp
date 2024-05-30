import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {ParamsStack} from './params';
import Profile from 'app/screen/Profile';
import {TopTabNavigator} from './TopTabNavigator';
import FriendRequests from 'app/screen/FriendRequests/FriendRequests';
import {
  MessageActionListItem,
  Chat,
  OverlayProvider,
} from 'stream-chat-react-native';
import {StreamChat} from 'stream-chat';
import {chatApiKey} from 'app/components/chat/chatConfig';
import {ChannelScreen} from 'app/screen/Chat/ChannelScreen';
import CallScreen from 'app/screen/Call/CallScreen';
import {
  StreamVideo,
  StreamVideoClient,
} from '@stream-io/video-react-native-sdk';
import useAuthStore from 'app/store/authStore';
import InCallScreen from 'app/screen/Call/InCallScreen';

const chatClient = StreamChat.getInstance(chatApiKey);

const CustomMessageActionListItem = ({action, actionType, ...rest}: any) => {
  if (actionType === 'threadReply') {
    return null;
  } else {
    return (
      <MessageActionListItem
        action={action}
        actionType={actionType}
        {...rest}
      />
    );
  }
};

const Stack = createNativeStackNavigator<ParamsStack>();
const MainNavigator = () => {
  const authUser = useAuthStore(s => s.user);

  const apiKey = chatApiKey;
  const user = {
    id: authUser.id,
    name: authUser.firstName + ' ' + authUser.lastName,
    image: authUser.avatar,
  };

  const token = chatClient.devToken(authUser.id);

  const client = new StreamVideoClient({apiKey, user, token});

  return (
    <OverlayProvider MessageActionListItem={CustomMessageActionListItem}>
      <Chat client={chatClient}>
        <StreamVideo client={client}>
          <Stack.Navigator
            screenOptions={{
              headerShown: false,
            }}>
            <Stack.Screen name="TabScreen" component={TopTabNavigator} />
            <Stack.Screen name="Profile" component={Profile} />
            <Stack.Screen name="FriendRequests" component={FriendRequests} />
            <Stack.Screen name="ChannelScreen" component={ChannelScreen} />
            <Stack.Screen name="CallScreen" component={CallScreen} />
            <Stack.Screen name="InCallScreen" component={InCallScreen} />
          </Stack.Navigator>
        </StreamVideo>
      </Chat>
    </OverlayProvider>
  );
};
export default MainNavigator;
