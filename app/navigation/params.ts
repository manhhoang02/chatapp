import {MaterialTopTabScreenProps} from '@react-navigation/material-top-tabs';
import {
  CompositeScreenProps,
  NavigatorScreenParams,
} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

export type ParamsTopTab = {
  Tab1: undefined;
  Tab2: undefined;
  Tab3: undefined;
  Tab4: undefined;
  Tab5: undefined;
};

export type ParamsStack = {
  TabScreen: NavigatorScreenParams<ParamsTopTab>;
  Profile: {id: string};
  FriendRequests: undefined;
  EmptyScreen1: undefined;
  ChannelScreen: undefined;
  CallScreen: undefined;
  InCallScreen: undefined;
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
