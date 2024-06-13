import {useMutation, useQuery} from '@tanstack/react-query';
import {Resp_User} from './auth.type';
import firestore from '@react-native-firebase/firestore';
import {COLLECTION} from 'app/store/globalStore';
import {sendNotification} from './notification';
import {
  showToastMessageError,
  showToastMessageSuccess,
} from '@abong.code/helpers/messageHelper';
import useAuthStore from 'app/store/authStore';
import {useDataStore} from 'app/store/dataStore';
import {removeVietnameseAccents} from 'helper/textHelper';

type AddFriendParams = {
  friendId: string;
};

export const addFriend = async (friendId: string) => {
  const userId = useAuthStore.getState().user.id;

  const userRef = firestore().doc(`${COLLECTION.USERS}/${userId}`);
  const friendRef = firestore().doc(`${COLLECTION.USERS}/${friendId}`);
  const {
    friend_requests: u_fr,
    friends: u_friends,
    lastName: u_lastName,
  } = await getUserById(userId);
  const {sent_friend_requests: f_sfr, friends: f_friends} = await getUserById(
    friendId,
  );

  await userRef.update({
    friend_requests: u_fr.filter(requestId => requestId !== friendId),
    friends: [...u_friends, friendId],
  });
  await friendRef.update({
    sent_friend_requests: f_sfr.filter(requestId => requestId !== userId),
    friends: [...f_friends, userId],
  });

  await sendNotification({
    title: 'Thông báo kết bạn',
    body: `${u_lastName} đã chấp nhận lời mời kết bạn của bạn`,
    topics: [friendId],
  });

  return {message: 'Thêm bạn thành công'};
};

export const useAddFriend = () => {
  return useMutation(
    ({friendId}: AddFriendParams): Promise<{message: string}> =>
      addFriend(friendId),
  );
};

type DeleteFriendRequestParams = {
  friendId: string;
};

export const useDeleteFriendRequest = () => {
  return useMutation(
    async ({
      friendId,
    }: DeleteFriendRequestParams): Promise<{message: string}> => {
      const userId = useAuthStore.getState().user.id;
      const userRef = firestore().doc(`${COLLECTION.USERS}/${userId}`);
      const friendRef = firestore().doc(`${COLLECTION.USERS}/${friendId}`);

      const friend_requests = (await getUserById(userId)).friend_requests;
      const sent_friend_requests = (await getUserById(friendId))
        .sent_friend_requests;

      await userRef.update({
        friend_requests: friend_requests.filter(
          requestId => requestId !== friendId,
        ),
      });
      await friendRef.update({
        sent_friend_requests: sent_friend_requests.filter(
          requestId => requestId !== userId,
        ),
      });

      return {message: 'Đã xóa lời mời'};
    },
  );
};

export const useSendRequestFriend = () =>
  useMutation(
    async ({friendId}: AddFriendParams): Promise<{message: string}> => {
      const userId = useAuthStore.getState().user.id;
      const userRef = firestore().doc(`${COLLECTION.USERS}/${userId}`);
      const friendRef = firestore().doc(`${COLLECTION.USERS}/${friendId}`);

      const {sent_friend_requests, lastName} = await getUserById(userId);
      const friend_requests = (await getUserById(friendId)).friend_requests;

      await userRef.update({
        sent_friend_requests: [...sent_friend_requests, friendId],
      });
      await friendRef.update({
        friend_requests: [...friend_requests, userId],
      });

      await sendNotification({
        title: 'Thông báo kết bạn',
        body: `${lastName} muốn kết bạn với bạn`,
        topics: [friendId],
      });

      return {message: 'Thêm bạn thành công'};
    },
  );

export const useCancelRequestFriend = () =>
  useMutation(
    async ({friendId}: AddFriendParams): Promise<{message: string}> => {
      const userId = useAuthStore.getState().user.id;
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

export const useGetUserById = (userId: string, reload?: number) => {
  return useQuery(['GET-USER-BY_ID', userId, reload], () =>
    getUserById(userId),
  );
};

type GetListUsersParams = {
  keyword?: string;
};

export const useGetListUsers = ({keyword}: GetListUsersParams = {}) => {
  return useQuery(
    ['GET-LIST-USERS', keyword],
    async (): Promise<Resp_User[]> => {
      const userId = useAuthStore.getState().user.id;
      try {
        const querySnapshot = await firestore()
          .collection(COLLECTION.USERS)
          .where('id', '!=', userId)
          .get();

        const list: Resp_User[] = [];
        querySnapshot.forEach(documentSnapshot => {
          list.push(documentSnapshot.data() as Resp_User);
        });
        return list.filter(item => {
          const fullName = `${item.firstName} ${item.lastName}`;
          const lowerName = removeVietnameseAccents(fullName.toLowerCase());
          const lowerKeyword = removeVietnameseAccents(
            keyword?.toLowerCase() ?? '',
          );
          return lowerName.includes(lowerKeyword);
        });
      } catch (error) {
        throw error;
      }
    },
  );
};

type DeleteFriendParams = {
  friendId: string;
};

export const useDeleteFriend = () => {
  return useMutation(
    async ({friendId}: DeleteFriendParams): Promise<{message: string}> => {
      const userId = useAuthStore.getState().user.id;
      const userRef = firestore().doc(`${COLLECTION.USERS}/${userId}`);
      const friendRef = firestore().doc(`${COLLECTION.USERS}/${friendId}`);

      const userDoc = await userRef.get();
      const currentFriends: string[] = userDoc.data()?.friends || [];
      const {friends} = await getUserById(friendId);

      const updatedFriends = currentFriends.filter(
        friend => friend !== friendId,
      );

      await userRef.update({friends: updatedFriends});
      await friendRef.update({
        friends: friends.filter(requestId => requestId !== userId),
      });
      return {message: 'Đã xóa bạn bè'};
    },
  );
};
type EditProfileParams = {
  data: Partial<Resp_User>;
};

export const useEditProfile = () => {
  return useMutation(
    async (params: EditProfileParams): Promise<{message: string}> => {
      const userId = useAuthStore.getState().user.id;
      const userRef = firestore().doc(`${COLLECTION.USERS}/${userId}`);
      await userRef.update(params.data);
      return {message: 'Cập nhật thành công'};
    },
    {
      onSuccess: res => {
        showToastMessageSuccess('Thành công', res.message);
      },
      onError: () => {
        showToastMessageError('Thất bại', 'Cập nhật thông tin thất bại');
      },
    },
  );
};

export function recentlyFriendListListener() {
  const userId = useAuthStore.getState().user.id;

  return firestore()
    .collection(COLLECTION.USERS)
    .doc(userId)
    .onSnapshot(async snapshot => {
      if (snapshot.exists) {
        const {friends} = snapshot.data() as Resp_User;
        const _tempData = await Promise.all(
          friends.map(async friendId => {
            return await getUserById(friendId);
          }),
        );

        const _sorted = _tempData.sort((a, b) => {
          return a.firstName.localeCompare(b.firstName);
        });

        useDataStore.getState().dispatchRecentlyData({friendData: _sorted});
      }
    });
}

export function recentlyFriendRequestListener() {
  const userId = useAuthStore.getState().user.id;

  return firestore()
    .collection(COLLECTION.USERS)
    .doc(userId)
    .onSnapshot(async snapshot => {
      if (snapshot.exists) {
        const {friend_requests} = snapshot.data() as Resp_User;
        const _tempData = await Promise.all(
          friend_requests.map(async friendId => {
            return await getUserById(friendId);
          }),
        );

        const _sorted = _tempData.sort((a, b) => {
          return a.firstName.localeCompare(b.firstName);
        });

        useDataStore
          .getState()
          .dispatchRecentlyData({friendRequestData: _sorted});
      }
    });
}

export function recentlyUserByIdListener(id: string) {
  return firestore()
    .collection(COLLECTION.USERS)
    .doc(id)
    .onSnapshot(snapshot => {
      if (snapshot.exists) {
        useDataStore
          .getState()
          .dispatchRecentlyData({userById: snapshot.data() as Resp_User});
      }
    });
}
