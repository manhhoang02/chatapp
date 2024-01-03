import React from 'react';
import {
  createBottomTabNavigator,
  BottomTabBarProps,
} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Home from 'app/screen/Home';
import Chats from 'app/screen/Chats';
import BottomTabBar from './container/BottomTabBar';
import {ParamsBottomTab, ParamsStack} from './params';
import FriendList from 'app/screen/FriendList/FriendList';
import ChatView from 'app/screen/ChatView/ChatView';
import Profile from 'app/screen/Profile';
import FriendRequests from 'app/screen/FriendRequests/FriendRequests';
import Menu from 'app/screen/Menu/Menu';
import {Host} from 'react-native-portalize';

const tabBarBottom = (props: BottomTabBarProps) => {
  return <BottomTabBar {...props} />;
};
const BottomTab = createBottomTabNavigator<ParamsBottomTab>();

const BottomTabScreen = () => {
  return (
    <Host>
      <BottomTab.Navigator
        screenOptions={{headerShown: false}}
        tabBar={tabBarBottom}>
        <BottomTab.Screen name="Home" component={Home} />
        <BottomTab.Screen name="FriendList" component={FriendList} />
        <BottomTab.Screen name="Chats" component={Chats} />
        <BottomTab.Screen name="Menu" component={Menu} />
      </BottomTab.Navigator>
    </Host>
  );
};

const Stack = createNativeStackNavigator<ParamsStack>();
const MainNavigator = () => {
  return (
    <Host>
      <Stack.Navigator
        // initialRouteName="Profile"
        screenOptions={{headerShown: false}}>
        <Stack.Screen name="TabScreen" component={BottomTabScreen} />
        <Stack.Screen name="ChatView" component={ChatView} />
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="FriendRequests" component={FriendRequests} />
      </Stack.Navigator>
    </Host>
  );
};
export default MainNavigator;
