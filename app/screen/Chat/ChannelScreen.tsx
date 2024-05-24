import React from 'react';
import {useChatContext} from 'app/components/chat/ChatContext';

import {Channel, MessageInput, MessageList} from 'stream-chat-react-native';
import {AppBlock, AppText} from '@starlingtech/element';
import {StatusBar, StyleSheet} from 'react-native';
import {consoleLog} from '@abong.code/helpers/logHelper';
import {useNavigation} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import color from '@abong.code/theme/color';
import LinearAvatar from 'app/components/LinearAvatar';

export function ChannelScreen() {
  const {goBack} = useNavigation();
  const {channel} = useChatContext();

  consoleLog('channel', channel);

  const avt = `https://getstream.io/random_png/?id=${channel.cid}&name=${channel.data?.name}`;

  return (
    <Channel channel={channel}>
      <AppBlock style={styles.header}>
        <AppBlock row alignItems="center" flex>
          <Ionicons
            name="arrow-back-outline"
            size={24}
            onPress={goBack}
            color={color.primary}
          />
          <LinearAvatar uri={avt} size={40} style={styles.mh12} />
          <AppText size={16} weight="700" numberOfLines={1}>
            {channel.data?.name}
          </AppText>
        </AppBlock>
        <AppBlock row alignItems="center">
          <Ionicons name="call" size={24} color={color.primary} />
          <Ionicons
            name="videocam"
            size={24}
            color={color.primary}
            style={styles.mh12}
          />
          <Ionicons name="information-circle" size={24} color={color.primary} />
        </AppBlock>
      </AppBlock>
      <MessageList />
      <MessageInput />
    </Channel>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    marginTop: StatusBar.currentHeight,
    height: 60,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  mh12: {marginHorizontal: 12},
});
