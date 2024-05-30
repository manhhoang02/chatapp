import React from 'react';
import {useChatContext} from 'app/components/chat/ChatContext';

import {Channel, MessageInput, MessageList} from 'stream-chat-react-native';
import {AppBlock, AppText} from '@starlingtech/element';
import {StatusBar, StyleSheet} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import color from '@abong.code/theme/color';
import LinearAvatar from 'app/components/LinearAvatar';
import {getStreamAvatar} from 'app/hook/useGetAvatar';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {ParamsStack} from 'app/navigation/params';
import {useStreamVideoClient} from '@stream-io/video-react-native-sdk';

export function ChannelScreen({
  navigation,
}: NativeStackScreenProps<ParamsStack, 'ChannelScreen'>) {
  const {channel} = useChatContext();

  const {avatar} = getStreamAvatar(channel);
  const client = useStreamVideoClient();

  const memberIds = Object.keys(channel.state.members);

  const members = memberIds.map(member => {
    return {user_id: member};
  });
  const callType = 'default';
  const callId = `callId_${memberIds.join('_')}`;

  const handleCall = async () => {
    if (client) {
      const call = await client.call(callType, callId).getOrCreate({
        ring: true,
        data: {
          members: members,
        },
      });
      console.log(call.duration, 'call');
      navigation.navigate('CallScreen');
    }
  };

  return (
    <Channel channel={channel}>
      <AppBlock style={styles.header}>
        <AppBlock row alignItems="center" flex>
          <Ionicons
            name="arrow-back-outline"
            size={24}
            onPress={() => navigation.goBack()}
            color={color.primary}
          />
          <LinearAvatar uri={avatar} size={40} style={styles.mh12} />
          <AppText size={16} weight="700" numberOfLines={1}>
            {channel.data?.name}
          </AppText>
        </AppBlock>
        <AppBlock row alignItems="center">
          <Ionicons
            name="call"
            size={24}
            color={color.primary}
            onPress={handleCall}
          />
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
