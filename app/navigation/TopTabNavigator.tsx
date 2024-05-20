import {Image, StatusBar, StyleSheet} from 'react-native';
import React from 'react';
import {
  MaterialTopTabBarProps,
  createMaterialTopTabNavigator,
} from '@react-navigation/material-top-tabs';
import {ParamsTopTab} from './params';
import {Host} from 'react-native-portalize';
import Home from 'app/screen/Home/Home';
import FriendList from 'app/screen/FriendList/FriendList';
import Chats from 'app/screen/Chat/Chats';
import Menu from 'app/screen/Menu/Menu';
import {AppBlock, AppTouchableOpacity} from '@starlingtech/element';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import TopTabBar from './container/TopTabBar';
import color from '@abong.code/theme/color';
import IconAdd from 'assets/icons/IconAdd';
import AppStyles from 'elements/AppStyles';
import IconSearch from 'assets/icons/IconSearch';
import Notifications from 'app/screen/Notifications';
import {ChatScreen} from 'app/screen/ChatScreen';
import { ChannelListScreen } from 'app/screen/ChannelListScreen';

const TopTab = createMaterialTopTabNavigator<ParamsTopTab>();

const tabBar = (props: MaterialTopTabBarProps) => {
  return <TopTabBar {...props} />;
};

export function TopTabNavigator() {
  const {top} = useSafeAreaInsets();
  return (
    <Host>
      <StatusBar
        barStyle={'dark-content'}
        translucent
        backgroundColor="transparent"
      />
      <AppBlock
        style={AppStyles.rowCenterBetween}
        pt={top}
        pl={12}
        pr={20}
        background="white">
        <Image
          source={require('assets/image/logo_text.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        <AppBlock row>
          <AppTouchableOpacity>
            <IconAdd width={24} color={color.primary} />
          </AppTouchableOpacity>
          <AppTouchableOpacity ml={20}>
            <IconSearch width={24} color={color.primary} />
          </AppTouchableOpacity>
        </AppBlock>
      </AppBlock>
      <TopTab.Navigator tabBar={tabBar}>
        <TopTab.Screen name="Tab1" component={Home} />
        <TopTab.Screen name="Tab2" component={FriendList} />
        <TopTab.Screen name="Tab3" component={Notifications} />
        <TopTab.Screen name="Tab4" component={ChannelListScreen} />
        <TopTab.Screen name="Tab5" component={Menu} />
      </TopTab.Navigator>
    </Host>
  );
}

const styles = StyleSheet.create({
  logo: {height: 30, width: 150},
});
