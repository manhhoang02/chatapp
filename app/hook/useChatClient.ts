import {chatApiKey} from 'app/components/chat/chatConfig';
import useAuthStore from 'app/store/authStore';
import {useEffect, useState} from 'react';
import {StreamChat} from 'stream-chat';

export const chatClient = StreamChat.getInstance(chatApiKey);

export const useChatClient = () => {
  const currentUser = useAuthStore(s => s.user);

  const [clientIsReady, setClientIsReady] = useState(false);

  useEffect(() => {
    const setupClient = async () => {
      await chatClient.connectUser(
        {
          id: currentUser.id,
          name: currentUser.firstName + ' ' + currentUser.lastName,
        },
        chatClient.devToken(currentUser.id),
      );
      setClientIsReady(true);
    };

    if (!chatClient.userID && currentUser.id) {
      setupClient();
    }
  }, [currentUser.firstName, currentUser.id, currentUser.lastName]);

  return {clientIsReady};
};

export const disconnectChatUser = async () => chatClient.disconnectUser();
