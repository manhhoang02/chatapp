import React from 'react';
import {useChatContext} from 'app/components/chat/ChatContext';

import {Channel, MessageInput, MessageList} from 'stream-chat-react-native';

export function ChannelScreen() {
  const {channel} = useChatContext();

  return (
    <Channel channel={channel}>
      <MessageList />
      <MessageInput />
    </Channel>
  );
}
