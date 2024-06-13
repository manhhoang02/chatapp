import {Post} from 'app/api/post.type';
import {createWithEqualityFn} from 'zustand/traditional';

export type MediaType = {
  uri: string;
  name: string;
};

type PostType = {
  media: MediaType[];
  visible: boolean;
  data?: Post;
};

type State = {
  post: PostType;
  dispatchPost: (p: Partial<PostType>) => void;
};

export const useHomeStore = createWithEqualityFn<State>(set => ({
  post: {
    media: [],
    visible: false,
  },
  dispatchPost: p => set(state => ({post: {...state.post, ...p}})),
}));
