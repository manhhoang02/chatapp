import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {ParamsStack} from './params';
import ChatView from 'app/screen/ChatView/ChatView';
import Profile from 'app/screen/Profile';
import {TopTabNavigator} from './TopTabNavigator';
import FriendRequests from 'app/screen/FriendRequests/FriendRequests';
import {Chat, OverlayProvider} from 'stream-chat-react-native';
import {StreamChat} from 'stream-chat';
import {chatApiKey} from '@abong.code/config/chatConfig';

const Stack = createNativeStackNavigator<ParamsStack>();
const MainNavigator = () => {
  const client = StreamChat.getInstance(chatApiKey);

  return (
    <OverlayProvider>
      <Chat client={client}>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}>
          <Stack.Screen name="TabScreen" component={TopTabNavigator} />
          <Stack.Screen name="ChatView" component={ChatView} />
          <Stack.Screen name="Profile" component={Profile} />
          <Stack.Screen name="FriendRequests" component={FriendRequests} />
        </Stack.Navigator>
      </Chat>
    </OverlayProvider>
  );
};
export default MainNavigator;
