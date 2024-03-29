import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {ParamsStack} from './params';
import ChatView from 'app/screen/ChatView/ChatView';
import Profile from 'app/screen/Profile';
import {Host} from 'react-native-portalize';
import {TopTabNavigator} from './TopTabNavigator';
import EmptyScreen1 from 'app/screen/EmptyScreen1';
import FriendRequests from 'app/screen/FriendRequests/FriendRequests';

const Stack = createNativeStackNavigator<ParamsStack>();
const MainNavigator = () => {
  return (
    <Host>
      <Stack.Navigator
        // initialRouteName="TabScreen"
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="TabScreen" component={TopTabNavigator} />
        <Stack.Screen name="ChatView" component={ChatView} />
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="FriendRequests" component={FriendRequests} />
        <Stack.Screen name="EmptyScreen1" component={EmptyScreen1} />
      </Stack.Navigator>
    </Host>
  );
};
export default MainNavigator;
