import {MaterialTopTabScreenProps} from '@react-navigation/material-top-tabs';
import {
  CompositeScreenProps,
  NavigatorScreenParams,
} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {DefaultStreamChatGenerics} from 'stream-chat-react-native';
import {Channel} from 'stream-chat';
import {ChatProps} from 'app/api/chat.type';

export type ParamsTopTab = {
  Tab1: undefined;
  Tab2: undefined;
  Tab3: undefined;
  Tab4: undefined;
  Tab5: undefined;
};

export type ParamsStack = {
  TabScreen: NavigatorScreenParams<ParamsTopTab>;
  ChatView: {thread: ChatProps};
  // ChatView: {
  //   chatId: string;
  //   chatName: string;
  //   avatar: string;
  //   friendId: string;
  // };
  Profile: {id: string};
  FriendRequests: undefined;
  EmptyScreen1: undefined;
};
export type ParamsAuth = {
  SplashScreen: undefined;
  Login: undefined;
  ConfirmEmail: undefined;
  Register: undefined;
  ConfirmOTP: {email: string};
  ResetPassword: {email: string};
};

export type TopTabScreenProps<T extends keyof ParamsTopTab> =
  CompositeScreenProps<
    MaterialTopTabScreenProps<ParamsTopTab, T>,
    NativeStackScreenProps<ParamsStack, keyof ParamsStack>
  >;
