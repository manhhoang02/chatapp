import {NavigatorScreenParams} from '@react-navigation/native';

export type ParamsBottomTab = {
  Home: undefined;
  Chats: undefined;
  FriendList: undefined;
  Menu: undefined;
};
export type ParamsStack = {
  TabScreen: NavigatorScreenParams<ParamsBottomTab>;
  ChatView: {
    chatId: string;
    chatName: string;
    avatar: string;
    friendId: string;
  };
  Profile: {id: string};
  FriendRequests: undefined;
};
export type ParamsAuth = {
  Login: undefined;
  ConfirmEmail: undefined;
  Register: undefined;
  ConfirmOTP: {email: string};
  ResetPassword: {email: string};
};
