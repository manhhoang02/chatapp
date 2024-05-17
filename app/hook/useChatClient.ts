import {
  chatApiKey,
  chatClient,
  useChatConfig,
} from '@abong.code/config/chatConfig';
import {useEffect, useState} from 'react';
import {StreamChat} from 'stream-chat';

export const useChatClient = () => {
  const {chatUserId, chatUserToken, chatUsername} = useChatConfig();

  const user = {
    id: chatUserId,
    name: chatUsername,
  };

  const [clientIsReady, setClientIsReady] = useState(false);

  useEffect(() => {
    const setupClient = async () => {
      await chatClient.connectUser(user, chatUserToken);
      setClientIsReady(true);

      if (!chatClient.userID) {
        await chatClient.connectUser(user, chatUserToken);
        setClientIsReady(true);
      } else {
        await chatClient.disconnectUser();
      }
    };

    setupClient();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {clientIsReady};
};
