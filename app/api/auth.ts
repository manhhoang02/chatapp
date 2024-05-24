import {useMutation, useQuery} from '@tanstack/react-query';
import {Resp_User} from './auth.type';
import firestore from '@react-native-firebase/firestore';
import {COLLECTION} from 'app/store/globalStore';
import useAuthStore from 'app/store/authStore';
import {shallow} from 'zustand/shallow';

export type FriendParams = {
  userId: string;
  friendId?: string;
  keyword?: string;
  reload?: number;
};
type GetFriendRequestParams = {
  userId: string;
  reload?: number;
};

export const useGetFriendRequests = ({
  userId,
  reload,
}: GetFriendRequestParams) => {
  return useQuery(
    ['GET-FRIEND-REQUEST', userId, reload],
    async (): Promise<Resp_User[]> => {
      try {
        const friend_request: Resp_User[] = [];
        const user = await getUserById(userId);
        const friend_request_Ids = user.friend_requests;

        const friendUsers = await Promise.all(
          friend_request_Ids.map(async friendId => getUserById(friendId)),
        );

        friend_request.push(...friendUsers);
        return friend_request;
      } catch (error) {
        throw error;
      }
    },
  );
};

type AddFriendParams = {
  userId: string;
  friendId: string;
};

export const useAddFriend = () => {
  return useMutation(
    async ({userId, friendId}: AddFriendParams): Promise<{message: string}> => {
      const userRef = firestore().doc(`${COLLECTION.USERS}/${userId}`);
      const friendRef = firestore().doc(`${COLLECTION.USERS}/${friendId}`);

      const {friend_requests, friends} = await getUserById(userId);
      const {sent_friend_requests: f_sfr, friends: f_friends} =
        await getUserById(friendId);

      // Update user object with modified friend lists
      await userRef.update({
        friend_requests: friend_requests.filter(
          requestId => requestId !== friendId,
        ),
        friends: [...friends, friendId],
      });
      await friendRef.update({
        sent_friend_requests: f_sfr.filter(requestId => requestId !== userId),
        friends: [...f_friends, userId],
      });

      return {message: 'Thêm bạn thành công'};
    },
  );
};

export const useDeleteFriendRequest = () => {
  return useMutation(
    async ({userId, friendId}: FriendParams): Promise<{message: string}> => {
      const userRef = firestore().doc(`${COLLECTION.USERS}/${userId}`);
      const {friend_requests} = await getUserById(userId);

      await userRef.update({
        friend_requests: friend_requests.filter(
          requestId => requestId !== friendId,
        ),
      });

      return {message: 'Đã xóa lời mời'};
    },
  );
};

export const useSendRequestFriend = () =>
  useMutation(
    async ({userId, friendId}: AddFriendParams): Promise<{message: string}> => {
      const userRef = firestore().doc(`${COLLECTION.USERS}/${userId}`);
      const friendRef = firestore().doc(`${COLLECTION.USERS}/${friendId}`);

      const sent_friend_requests = (await getUserById(userId))
        .sent_friend_requests;
      const friend_requests = (await getUserById(friendId)).friend_requests;

      await userRef.update({
        sent_friend_requests: [...sent_friend_requests, friendId],
      });
      await friendRef.update({
        friend_requests: [...friend_requests, userId],
      });

      return {message: 'Thêm bạn thành công'};
    },
  );
export const useCancelRequestFriend = () =>
  useMutation(
    async ({userId, friendId}: AddFriendParams): Promise<{message: string}> => {
      const userRef = firestore().doc(`${COLLECTION.USERS}/${userId}`);
      const friendRef = firestore().doc(`${COLLECTION.USERS}/${friendId}`);

      const sent_friend_requests = (await getUserById(userId))
        .sent_friend_requests;
      const friend_requests = (await getUserById(friendId)).friend_requests;

      await userRef.update({
        sent_friend_requests: sent_friend_requests.filter(
          requestId => requestId !== friendId,
        ),
      });
      await friendRef.update({
        friend_requests: friend_requests.filter(
          requestId => requestId !== userId,
        ),
      });

      return {message: 'Hủy lời mời kết bạn thành công'};
    },
  );

export const getUserById = (userId: string): Promise<Resp_User> => {
  return firestore()
    .collection(COLLECTION.USERS)
    .doc(userId)
    .get()
    .then(response => {
      if (response.exists) {
        return response.data() as Resp_User;
      } else {
        throw new Error('User not found');
      }
    })
    .catch(error => {
      throw error;
    });
};

export const useGetUserById = (userId: string) => {
  return useQuery(['GET-USER-BY_ID', userId], () => getUserById(userId));
};

type GetFriendsParams = {
  userId: string;
  keyword?: string;
  reload?: number;
};

export const useGetFriends = ({userId, keyword, reload}: GetFriendsParams) => {
  return useQuery(
    ['GET-FRIENDS', userId, keyword, reload],
    async (): Promise<Resp_User[]> => {
      try {
        const friends: Resp_User[] = [];
        const user = await getUserById(userId);
        const friendIds = user.friends;

        const friendUsers = await Promise.all(
          friendIds.map(async friendId => getUserById(friendId)),
        );

        friends.push(...friendUsers);
        return keyword
          ? friends.filter(
              item =>
                item.firstName.toLowerCase().includes(keyword.toLowerCase()) ||
                item.lastName.toLowerCase().includes(keyword.toLowerCase()),
            )
          : friends;
      } catch (error) {
        throw error;
      }
    },
  );
};

type GetListUsersParams = {
  keyword?: string;
  userId: string;
};

export const useGetListUsers = ({keyword, userId}: GetListUsersParams) => {
  return useQuery(
    ['GET-LIST-USERS', keyword],
    async (): Promise<Resp_User[]> => {
      try {
        const querySnapshot = await firestore()
          .collection(COLLECTION.USERS)
          .where('id', '!=', userId)
          .get();

        const list: Resp_User[] = [];
        querySnapshot.forEach(documentSnapshot => {
          list.push(documentSnapshot.data() as Resp_User);
        });
        return keyword
          ? list.filter(
              item =>
                item.firstName.toLowerCase().includes(keyword.toLowerCase()) ||
                item.lastName.toLowerCase().includes(keyword.toLowerCase()),
            )
          : list;
      } catch (error) {
        throw error;
      }
    },
  );
};

type DeleteFriendParams = {
  userId: string;
  friendId: string;
};

export const useDeleteFriend = () => {
  return useMutation(
    async ({
      userId,
      friendId,
    }: DeleteFriendParams): Promise<{message: string}> => {
      const userRef = firestore().doc(`${COLLECTION.USERS}/${userId}`);

      const userDoc = await userRef.get();
      const currentFriends: string[] = userDoc.data()?.friends || [];

      const updatedFriends = currentFriends.filter(
        friend => friend !== friendId,
      );

      await userRef.update({friends: updatedFriends});

      return {message: 'Đã xóa bạn bè'};
    },
  );
};

export const getMyProfileAndDispatch = async () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [dispatchUser, user] = useAuthStore(
    s => [s.dispatchUser, s.user],
    shallow,
  );

  const resUser = await getUserById(user.id);

  dispatchUser({...user, ...resUser});
};
