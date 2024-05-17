import {Comment} from './comment.type';
import {useMutation, useQuery} from '@tanstack/react-query';
import firestore from '@react-native-firebase/firestore';
import {COLLECTION} from 'app/store/globalStore';

type GetCommentsParams = {
  postId: string;
  reload: number;
};

export const useGetComments = (params: GetCommentsParams) => {
  return useQuery(['GET_POSTS', params], async (): Promise<Comment[]> => {
    const comment_doc = firestore()
      .collection(COLLECTION.POSTS)
      .doc(params.postId)
      .collection(COLLECTION.COMMENTS);
    // .doc();
    try {
      const querySnapshot = await comment_doc
        .orderBy('createdAt', 'desc')
        .get();
      const comments: Comment[] = [];
      querySnapshot.forEach(documentSnapshot => {
        comments.push(documentSnapshot.data() as Comment);
      });
      return comments;
    } catch (error) {
      throw error;
    }
  });
};

type CreateCommentParams = {
  author: string;
  files: string[];
  text: string;
  postId: string;
};

export const useCreateComment = () =>
  useMutation(
    async (params: CreateCommentParams): Promise<{message: string}> => {
      const comment_doc = firestore()
        .collection(COLLECTION.POSTS)
        .doc(params.postId)
        .collection(COLLECTION.COMMENTS)
        .doc();

      try {
        await comment_doc.set({
          ...params,
          id: comment_doc.id,
          users_liked: [],
          comments: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
        return {
          message: 'Thành công!',
        };
      } catch (error: any) {
        throw new Error(error);
      }
    },
  );
