import {Comment} from './comment.type';
import {useMutation, useQuery} from '@tanstack/react-query';
import firestore from '@react-native-firebase/firestore';
import {COLLECTION} from 'app/store/globalStore';
import {useDataStore} from 'app/store/dataStore';
import {getUserById} from './auth';
import {sendNotification} from './notification';
import useAuthStore from 'app/store/authStore';

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

export function recentlyCommentListener(postId: string) {
  return firestore()
    .collection(COLLECTION.POSTS)
    .doc(postId)
    .collection(COLLECTION.COMMENTS)
    .orderBy('createdAt', 'desc')
    .limit(20)
    .onSnapshot(async snapshot => {
      const _tempData = snapshot.docs
        .map(item => {
          return item.data();
        })
        .filter(data => data !== undefined);

      useDataStore
        .getState()
        .dispatchRecentlyData({commentData: _tempData as Comment[]});
    });
}

type CreateCommentParams = {
  author: string;
  files: string[];
  text: string;
  postId: string;
};

export const useCreateComment = () =>
  useMutation(async (params: CreateCommentParams) => {
    const comment_doc = firestore()
      .collection(COLLECTION.POSTS)
      .doc(params.postId)
      .collection(COLLECTION.COMMENTS)
      .doc();

    await comment_doc.set({
      ...params,
      id: comment_doc.id,
      users_liked: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  });

export const likeOrDislikeComment = async (
  postId: string,
  commentId: string,
) => {
  const userId = useAuthStore.getState().user.id;

  const commentDoc = firestore().doc(
    `${COLLECTION.POSTS}/${postId}/${COLLECTION.COMMENTS}/${commentId}`,
  );
  const post = await commentDoc.get();
  const data = post.data() as Comment;

  const {firstName, lastName} = await getUserById(userId);
  const name = firstName + ' ' + lastName;

  if (data.users_liked.includes(userId)) {
    await commentDoc.update({
      users_liked: firestore.FieldValue.arrayRemove(userId),
    });
  } else {
    await commentDoc.update({
      users_liked: firestore.FieldValue.arrayUnion(userId),
    });

    if (data.author !== userId) {
      await sendNotification({
        title: 'Thông báo',
        body: `${name} đã thích bình luận của bạn`,
        topics: [data.author],
      });
    }
  }
};

type ReplyCommentParams = {
  author: string;
  files: string[];
  text: string;
  postId: string;
  commentId: string;
};

export const useReplyComment = () =>
  useMutation(async (params: ReplyCommentParams) => {
    const reply_doc = firestore()
      .collection(COLLECTION.POSTS)
      .doc(params.postId)
      .collection(COLLECTION.COMMENTS)
      .doc(params.commentId)
      .collection(COLLECTION.REPLIES)
      .doc();

    await reply_doc.set({
      ...params,
      id: reply_doc.id,
      users_liked: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  });

export const deleteComment = async ({
  postId,
  commentId,
}: {
  postId: string;
  commentId: string;
}): Promise<void> => {
  const userId = useAuthStore.getState().user.id;

  const comment_doc = firestore().doc(
    `${COLLECTION.POSTS}/${postId}/${COLLECTION.COMMENTS}/${commentId}`,
  );

  const {author} = (await comment_doc.get()).data() as Comment;
  if (author !== userId) {
    return;
  }

  await comment_doc.delete();
};

export const deleteReplyComment = async ({
  postId,
  commentId,
  replyId,
}: {
  postId: string;
  commentId: string;
  replyId: string;
}): Promise<void> => {
  const replyDoc = firestore().doc(
    `${COLLECTION.POSTS}/${postId}/${COLLECTION.COMMENTS}/${commentId}/${COLLECTION.REPLIES}/${replyId}`,
  );

  await replyDoc.delete();
};
