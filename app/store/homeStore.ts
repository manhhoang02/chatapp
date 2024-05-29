import {Post} from 'app/api/post.type';
import {DocumentPickerResponse} from 'react-native-document-picker';
import {createWithEqualityFn} from 'zustand/traditional';

type PostType = {
  media: DocumentPickerResponse[];
  visible: boolean;
  data?: Post;
};

type SyncType = {
  post: number;
  friend: number;
  chat: number;
  liked: number;
};

type State = {
  sync: SyncType;
  post: PostType;
  dispatchPost: (p: Partial<PostType>) => void;
  dispatchSync: (p: Partial<SyncType>) => void;
};

export const useHomeStore = createWithEqualityFn<State>(set => ({
  sync: {
    post: 0,
    friend: 0,
    chat: 0,
    liked: 0,
  },
  post: {
    media: [],
    visible: false,
  },
  dispatchPost: p => set(state => ({post: {...state.post, ...p}})),
  dispatchSync: p => set(state => ({sync: {...state.sync, ...p}})),
}));
