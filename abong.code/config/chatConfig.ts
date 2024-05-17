import useAuthStore from 'app/store/authStore';
import {StreamChat} from 'stream-chat';

const useChatConfig = () => {
  const {user} = useAuthStore();

  const chatUserId = user.id;
  const chatUserToken = chatClient.devToken(user.id);
  const chatUsername = user.firstName + ' ' + user.lastName;

  return {
    chatUserToken,
    chatUserId,
    chatUsername,
  };
};

const chatApiKey = '5488wk3dwn85';
const chatApiSecret =
  '4h9m9qrtnsex3zwnv77hzaysu3cn4dabzz37hgyst3hg2q968drfgt2c6cvscx9z';
const chatClient = StreamChat.getInstance(chatApiKey);

export {useChatConfig, chatClient, chatApiKey};
