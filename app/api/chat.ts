import axios from 'axios';
import Config from 'react-native-config';
import {ChatProps, ResMessages, ResSendMessage} from './chat.type';
import {useMutation, useQuery} from '@tanstack/react-query';
import firestore from '@react-native-firebase/firestore';
import {COLLECTION} from 'app/store/globalStore';

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

type ParamsGetChats = {
  userId: string;
  reload?: number;
};

export const useGetChats = ({}: ParamsGetChats) => {
  return useQuery(['GET_CHATS'], async (): Promise<ChatProps[]> => {
    const chat_doc = firestore().collection(COLLECTION.CHATS);
    try {
      const querySnapshot = await chat_doc.orderBy('createdAt', 'desc').get();
      const chats: ChatProps[] = [];
      querySnapshot.forEach(documentSnapshot => {
        chats.push(documentSnapshot.data() as ChatProps);
      });
      return chats;
    } catch (error) {
      throw error;
    }
  });
};

type ParamsCreateChats = {
  members: string[];
  name: string;
};

export const useCreateChat = () => {
  return useMutation(
    async ({members, name}: ParamsCreateChats): Promise<{message: string}> => {
      const chat_doc = firestore().collection(COLLECTION.CHATS);
      try {
        const id = members.join('_');
        await chat_doc.add({
          _id: id,
          members,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          lastMessage: `${name} đã được tạo. Hãy bắt đầu trò chuyện với`,
          name,
        } as ChatProps);

        return {
          message: 'Thành công!',
        };
      } catch (error: any) {
        throw new Error(error);
      }
    },
  );
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
