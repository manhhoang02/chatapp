import {useMutation, useQuery} from '@tanstack/react-query';
import {Post} from './post.type';
import firestore from '@react-native-firebase/firestore';
import {COLLECTION} from 'app/store/globalStore';
import {getUserById} from './auth';
import {sendNotification} from './notification';
import {DocumentPickerResponse} from 'react-native-document-picker';
import moment from 'moment';

type ParamsGetPosts = {
  reload?: number;
  userId: string;
};

export const useGetPosts = ({reload, userId}: ParamsGetPosts) =>
  useQuery(['GET_POSTS', reload], async (): Promise<Post[]> => {
    try {
      const querySnapshot = await firestore()
        .collection(COLLECTION.POSTS)
        .orderBy('createdAt', 'desc')
        .get();

      const posts: Post[] = [];
      const {friends} = await getUserById(userId);

      querySnapshot.forEach(documentSnapshot => {
        const data = documentSnapshot.data() as Post;
        if (friends.includes(data.author) || data.author === userId) {
          posts.push(data);
        }
      });

      return posts;
    } catch (error) {
      throw error;
    }
  });

export const useGetPostById = (postId: string, reload?: number) => {
  return useQuery(
    ['GET-POST-BY-ID', postId, reload],
    async (): Promise<Post> => {
      const post = await firestore()
        .collection(COLLECTION.POSTS)
        .doc(postId)
        .get();

      if (post.exists) {
        return post.data() as Post;
      }
      throw new Error('Không tìm thấy bài viết');
    },
  );
};

type CreatePostParams = {
  author: string;
  files: DocumentPickerResponse[];
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
        message: 'Thành công! Đã đăng bài viết mới',
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
      files?: DocumentPickerResponse[];
    }) => {
      const postReference = firestore().doc(
        `${COLLECTION.POSTS}/${params.postId}`,
      );
      await postReference.update({
        description: params.description,
        files: params.files,
        updatedAt: new Date().toISOString(),
      });
      return {message: 'Thành công! Đã chỉnh sửa bài viết'};
    },
  );
};
