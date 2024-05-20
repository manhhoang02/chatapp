import {AppBlock, AppButton} from '@starlingtech/element';
import {useChatContext} from 'app/components/chat/ChatContext';
import {chatClient} from 'app/hook/useChatClient';
import useAuthStore from 'app/store/authStore';
import React from 'react';
import {ChannelList} from 'stream-chat-react-native'; // Or stream-chat-expo

const sort = {
  last_message_at: -1,
};

export const ChannelListScreen = ({navigation}: any) => {
  const userId = useAuthStore(s => s.user.id);

  const {setChannel} = useChatContext();

  const filters = {
    members: {
      $in: [userId],
    },
  };

  const onCreateChannel = () => {
    const channel = chatClient.channel('messaging', {
      members: [userId, 'ruABbO3DpWe7vDAKiqBwlSI5gj03'],
      name: 'Test Channel',
    });
    setChannel(channel);
    navigation.navigate('ChannelScreen');
  };

  const onSelect = channel => {
    setChannel(channel);
    navigation.navigate('ChannelScreen');
  };

  return (
    <AppBlock flex>
      {/* <AppButton
        primary
        text="Create channel"
        alignSelf="center"
        onPress={onCreateChannel}
      /> */}
      <ChannelList filters={filters} sort={sort} onSelect={onSelect} />
    </AppBlock>
  );
};
