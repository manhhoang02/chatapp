import {useMutation, useQuery} from '@tanstack/react-query';
import {Post} from './post.type';
import firestore from '@react-native-firebase/firestore';
import {COLLECTION} from 'app/store/globalStore';
import {getUserById} from './auth';

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

export const getPostById = (postId: string): Promise<Post> => {
  return firestore()
    .collection(COLLECTION.POSTS)
    .doc(postId)
    .get()
    .then(response => {
      if (response.exists) {
        return response.data() as Post;
      } else {
        throw new Error('Không tìm thấy bài viết');
      }
    })
    .catch(error => {
      throw error;
    });
};

export const useGetPostById = (postId: string) => {
  return useQuery(['GET-POST-BY_ID', postId], () => getPostById(postId));
};

type CreatePostParams = {
  author: string;
  files: string[];
  description: string;
};

export const createPost = async (
  params: CreatePostParams,
): Promise<{message: string}> => {
  const post_doc = firestore().collection(COLLECTION.POSTS).doc();

  return post_doc
    .set({
      ...params,
      id: post_doc.id,
      users_liked: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
    .then(() => {
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

  return await firestore().runTransaction(async transaction => {
    const postSnapshot = await transaction.get(postReference);

    if (!postSnapshot.exists) {
      throw new Error('Bài viết không tồn tại!');
    }

    const postData = postSnapshot.data() as Post;
    const isLiked = postData.users_liked.includes(userId);

    const updatedUsersLiked = isLiked
      ? postData.users_liked.filter(id => id !== userId)
      : [...postData.users_liked, userId];

    transaction.update(postReference, {users_liked: updatedUsersLiked});
  });
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
      return posts;
    } catch (error) {
      throw error;
    }
  });
