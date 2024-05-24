import {ChatProps} from './chat.type';
import {useMutation, useQuery} from '@tanstack/react-query';
import firestore from '@react-native-firebase/firestore';
import {COLLECTION} from 'app/store/globalStore';

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
