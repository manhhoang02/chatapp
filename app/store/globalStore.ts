import {create} from 'zustand';

export enum COLLECTION {
  USERS = 'users',
  POSTS = 'posts',
  CHATS = 'chats',
  COMMENTS = 'comments',
  MESSAGES = 'messages',
  NOTIFICATIONS = 'notifications',
}

type State = {
  isFirstTime: boolean;
  dispatchIsFirstTime: (p: boolean) => void;
};

export const useGlobalStore = create<State>(set => ({
  isFirstTime: true,
  dispatchIsFirstTime: p => set({isFirstTime: p}),
}));
