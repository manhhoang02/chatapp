import {useMutation, useQuery} from '@tanstack/react-query';
import {Post} from './post.type';
import firestore from '@react-native-firebase/firestore';
import {COLLECTION} from 'app/store/globalStore';
import {getUserById} from './auth';
import {sendNotification} from './notification';
import moment from 'moment';
import {MediaType} from 'app/store/homeStore';
import useAuthStore from 'app/store/authStore';
import {useDataStore} from 'app/store/dataStore';

export function recentlyPostListener() {
  const uid = useAuthStore.getState().user.id;
  return firestore()
    .collection(COLLECTION.POSTS)
    .limit(10)
    .orderBy('createdAt', 'desc')
    .onSnapshot(async snapshot => {
      const {friends} = await getUserById(uid);
      const _tempData = snapshot.docs
        .map(item => {
          const data = item.data() as Post;
          if (friends.includes(data.author) || data.author === uid) {
            return item.data();
          }
        })
        .filter(data => data !== undefined);

      useDataStore
        .getState()
        .dispatchRecentlyData({postData: _tempData as Post[]});
    });
}

export function recentlyPostByIdListener(postId: string) {
  return firestore()
    .collection(COLLECTION.POSTS)
    .doc(postId)
    .onSnapshot(snapshot => {
      if (snapshot.exists) {
        useDataStore
          .getState()
          .dispatchRecentlyData({postById: snapshot.data() as Post});
      }
    });
}

type CreatePostParams = {
  author: string;
  files: MediaType[];
  description: string;
};

export const createPost = async (
  params: CreatePostParams,
): Promise<{message: string}> => {
  const post_doc = firestore().collection(COLLECTION.POSTS).doc();

  const user = await getUserById(params.author);

  return post_doc
    .set({
      ...params,
      id: post_doc.id,
      users_liked: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
    .then(async () => {
      await sendNotification({
        title: 'Thông báo',
        body: `${
          user.firstName + ' ' + user.lastName
        } đã đăng một bài viết mới`,
        topics: [...user.friends],
      });

      return {
        message: 'Đã đăng bài viết mới',
      };
    })
    .catch(error => {
      throw new Error(error);
    });
};

export const useCreatePost = () =>
  useMutation((params: CreatePostParams) => createPost(params));

export const likeOrDislikePost = async (postId: string, userId: string) => {
  const postReference = firestore().doc(`${COLLECTION.POSTS}/${postId}`);
  const post = await postReference.get();
  const data = post.data() as Post;
  const {firstName, lastName} = await getUserById(userId);
  const name = firstName + ' ' + lastName;

  if (data.users_liked.includes(userId)) {
    await postReference.update({
      users_liked: firestore.FieldValue.arrayRemove(userId),
    });
  } else {
    await postReference.update({
      users_liked: firestore.FieldValue.arrayUnion(userId),
    });

    if (data.author !== userId) {
      await sendNotification({
        title: 'Thông báo',
        body: `${name} đã thích bài viết của bạn`,
        topics: [data.author],
      });
    }
  }
};

export const useDeletePost = () => {
  return useMutation(
    async ({postId}: {postId: string}): Promise<{message: string}> => {
      await firestore().collection(COLLECTION.POSTS).doc(postId).delete();
      return {message: 'Đã xóa bài viết'};
    },
  );
};

type GetUserPostsParams = {
  userId: string;
  reload?: number;
};

export const useGetUserPosts = ({reload, userId}: GetUserPostsParams) =>
  useQuery(['GET-USER-POSTS', reload, userId], async (): Promise<Post[]> => {
    try {
      const querySnapshot = await firestore()
        .collection(COLLECTION.POSTS)
        .where('author', '==', userId)
        .orderBy('createdAt', 'desc')
        .get();

      const posts: Post[] = [];
      querySnapshot.forEach(documentSnapshot => {
        posts.push(documentSnapshot.data() as Post);
      });
      return posts.sort((a, b) =>
        moment(b.updatedAt).diff(moment(a.updatedAt)),
      );
    } catch (error) {
      throw error;
    }
  });

export const useEditPost = () => {
  return useMutation(
    async (params: {
      postId: string;
      description?: string;
      files?: MediaType[];
    }) => {
      const postReference = firestore().doc(
        `${COLLECTION.POSTS}/${params.postId}`,
      );
      await postReference.update({
        description: params.description,
        files: params.files,
        updatedAt: new Date().toISOString(),
      });
      return {message: 'Đã chỉnh sửa bài viết'};
    },
  );
};
