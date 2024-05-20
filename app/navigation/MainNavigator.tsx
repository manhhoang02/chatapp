import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {ParamsStack} from './params';
import ChatView from 'app/screen/ChatView/ChatView';
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
import {ChannelScreen} from 'app/screen/ChannelScreen';

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
  return (
    <OverlayProvider MessageActionListItem={CustomMessageActionListItem}>
      <Chat client={chatClient}>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}>
          <Stack.Screen name="TabScreen" component={TopTabNavigator} />
          <Stack.Screen name="ChatView" component={ChatView} />
          <Stack.Screen name="Profile" component={Profile} />
          <Stack.Screen name="FriendRequests" component={FriendRequests} />
          <Stack.Screen name="ChannelScreen" component={ChannelScreen} />
        </Stack.Navigator>
      </Chat>
    </OverlayProvider>
  );
};
export default MainNavigator;
