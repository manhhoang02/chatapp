import {useChatContext} from 'app/components/chat/ChatContext';
import React, {useState} from 'react';

import color from '@abong.code/theme/color';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AppBlock, AppText} from '@starlingtech/element';
import {useStreamVideoClient} from '@stream-io/video-react-native-sdk';
import LinearAvatar from 'app/components/LinearAvatar';
import {ParamsStack} from 'app/navigation/params';
import {useGetChannelInfo} from 'helper/channelHelper';
import {randomId} from 'helper/randomId';
import {StatusBar, StyleSheet} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Channel, MessageInput, MessageList} from 'stream-chat-react-native';
import ModalChannelDetail from 'app/components/modals/ModalChannelDetail/ModalChannelDetail';

export function ChannelScreen({
  navigation,
}: NativeStackScreenProps<ParamsStack, 'ChannelScreen'>) {
  const {channel} = useChatContext();

  const {avatar, channelName} = useGetChannelInfo(channel);
  const client = useStreamVideoClient();

  const [showDetail, setShowDetail] = useState(false);

  const memberIds = Object.keys(channel.state.members);

  const members = memberIds.map(member => {
    return {user_id: member};
  });
  const handleCall = async () => {
    if (client) {
      const call = client.call('default', randomId());
      await call.getOrCreate({
        ring: true,
        data: {
          settings_override: {
            ring: {
              auto_cancel_timeout_ms: 30000,
              incoming_call_timeout_ms: 5000,
            },
          },
          members,
        },
      });
    }
  };

  const toggleDetail = () => {
    setShowDetail(!showDetail);
  };

  // const createPoll = async () => {
  //   const poll = await chatClient.createPoll({
  //     name: 'Where should we host our next company event?',
  //     options: [
  //       {
  //         text: 'Amsterdam, The Netherlands',
  //         foo: 'bar',
  //       },
  //       {
  //         text: 'Boulder, CO',
  //         foo: 'baz',
  //       },
  //     ],
  //     foo: 'bar',
  //   });

  //   consoleLog('message', poll);

  //   // message.poll contains all relevant poll data
  // };

  return (
    <Channel channel={channel}>
      <>
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
              {channelName}
            </AppText>
          </AppBlock>
          <AppBlock row alignItems="center">
            {/* <Ionicons
            name="call"
            size={24}
            color={color.primary}
            onPress={handleCall}
          /> */}
            <Ionicons
              name="videocam"
              size={24}
              color={color.primary}
              style={styles.mh12}
              onPress={handleCall}
            />
            <Ionicons
              name="information-circle"
              size={24}
              color={color.primary}
              onPress={toggleDetail}
            />
          </AppBlock>
        </AppBlock>
        <MessageList />
        <MessageInput />

        <ModalChannelDetail isVisible={showDetail} onClose={toggleDetail} />
      </>
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
