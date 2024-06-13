import {Alert, StyleSheet, View, useWindowDimensions} from 'react-native';
import React from 'react';
import ReactNativeModal from 'react-native-modal';
import color from '@abong.code/theme/color';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {AppBlock, AppText} from '@starlingtech/element';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import LinearAvatar from '../../LinearAvatar';
import {useChatContext} from '../../chat/ChatContext';
import {SceneMap, TabBar, TabView} from 'react-native-tab-view';
import {useGetChannelInfo} from 'helper/channelHelper';
import DetailMembers from './container/Detail.Members';
import DetailMedia from './container/Detail.Media';
import DetailFiles from './container/Detail.Files';
import AppStyles from 'elements/AppStyles';
import {useNavigation} from '@react-navigation/native';

type Props = {
  isVisible: boolean;
  onClose: () => void;
};

const routes = [
  {key: 'members', title: 'Members'},
  {key: 'media', title: 'Media'},
  {key: 'files', title: 'Files'},
];

const renderScene = SceneMap({
  members: DetailMembers,
  media: DetailMedia,
  files: DetailFiles,
});

export default function ({isVisible, onClose}: Props) {
  const {top, bottom} = useSafeAreaInsets();
  const {channel} = useChatContext();
  const layout = useWindowDimensions();
  const {goBack} = useNavigation();

  const [index, setIndex] = React.useState(0);

  const {avatar, channelName} = useGetChannelInfo(channel);

  const onDeleteChannel = async () => {
    Alert.alert('Xoá kênh', 'Bạn có chắc chắn muốn xoá kênh này?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'OK',
        onPress: async () => {
          await channel.delete();
          onClose();
          goBack();
        },
      },
    ]);
  };

  const renderTabBar = (props: any) => {
    return (
      <TabBar
        {...props}
        indicatorStyle={{backgroundColor: color.primary}}
        style={{backgroundColor: color.white}}
        activeColor={color.primary}
        inactiveColor={color.disabled}
        labelStyle={styles.labelStyle}
      />
    );
  };

  return (
    <ReactNativeModal
      animationIn={'slideInRight'}
      animationOut={'slideOutRight'}
      isVisible={isVisible}
      statusBarTranslucent
      useNativeDriver
      hasBackdrop={false}
      onBackdropPress={onClose}
      onBackButtonPress={onClose}
      style={styles.modal}>
      <View
        style={[
          styles.container,
          {
            paddingBottom: bottom,
            paddingTop: top,
          },
        ]}>
        <AppBlock style={AppStyles.rowCenterBetween} pr={16}>
          <Ionicons
            name="arrow-back-outline"
            size={24}
            onPress={onClose}
            style={styles.back}
            color={color.black}
          />
          <Ionicons
            name="trash-outline"
            size={24}
            color={color.danger}
            onPress={onDeleteChannel}
          />
        </AppBlock>
        <AppBlock mb={20} alignItems="center">
          <LinearAvatar uri={avatar} size={90} />
          <AppText mt={8} size={16} weight="700" numberOfLines={1}>
            {channelName}
          </AppText>
        </AppBlock>

        <TabView
          navigationState={{index, routes}}
          renderScene={renderScene}
          renderTabBar={renderTabBar}
          onIndexChange={setIndex}
          initialLayout={{width: layout.width}}
        />
      </View>
    </ReactNativeModal>
  );
}

const styles = StyleSheet.create({
  labelStyle: {
    textTransform: 'capitalize',
    fontSize: 16,
    fontWeight: '500',
  },
  back: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  container: {
    flexGrow: 1,
    backgroundColor: color.white,
  },
  modal: {
    flex: 1,
    margin: 0,
  },
});
