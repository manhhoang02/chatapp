import {Resp_User} from 'app/api/auth.type';
import {Comment} from 'app/api/comment.type';
import {Notification} from 'app/api/notification.type';
import {Post} from 'app/api/post.type';
import {createWithEqualityFn} from 'zustand/traditional';

type DataStoreType = {
  postData: Post[];
  postById?: Post;
  commentData: Comment[];
  friendData: Resp_User[];
  friendRequestData: Resp_User[];
  userById?: Resp_User;
  notificationData: Notification[];
};

type State = {
  recentlyData: DataStoreType;
  dispatchRecentlyData: (p: Partial<DataStoreType>) => void;
};

export const useDataStore = createWithEqualityFn<State>(set => ({
  recentlyData: {
    postData: [],
    commentData: [],
    friendData: [],
    friendRequestData: [],
    notificationData: [],
  },
  dispatchRecentlyData: data =>
    set(state => ({recentlyData: {...state.recentlyData, ...data}})),
}));
