import axios from 'axios';
import Config from 'react-native-config';
import {ChatProps, ResMessages, ResSendMessage} from './chat.type';

export const getAllChats = async (
  userId: string,
  limit: number,
): Promise<ChatProps[]> => {
  return await axios
    .get(`${Config.BASE_URL}/chat/${userId}?limit=${limit}`)
    .then(({data}) => {
      return data;
    })
    .catch(error => {
      throw new Error(error.message);
    });
};
export const createChat = async (
  userId: string,
  friendId: string,
): Promise<ChatProps> => {
  return await axios
    .post(`${Config.BASE_URL}/chat/create`, {userId, friendId})
    .then(({data}) => {
      return data;
    })
    .catch(error => {
      throw new Error(error.message);
    });
};

export const getAllMessages = async (
  chatId: string,
): Promise<ResMessages[]> => {
  return await axios
    .get(`${Config.BASE_URL}/message/${chatId}`)
    .then(({data}) => {
      return data;
    })
    .catch(error => {
      throw new Error(error.message);
    });
};

export const getChat = async (
  userId: string,
  friendId: string,
): Promise<ChatProps> => {
  return await axios
    .get(`${Config.BASE_URL}/chat/${userId}/${friendId}`)
    .then(({data}) => {
      return data;
    })
    .catch(error => {
      throw new Error(error.message);
    });
};

export const sendMessage = async (
  params: FormData,
): Promise<ResSendMessage> => {
  return await axios
    .post(`${Config.BASE_URL}/message`, params, {
      headers: {
        'Content-Type': 'multipart/form-data', // android sẽ lỗi nếu k có
      },
    })
    .then(({data}) => {
      return data;
    })
    .catch(error => {
      throw new Error(error.message);
    });
};
