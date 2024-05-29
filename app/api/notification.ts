import axios from 'axios';
import firestore from '@react-native-firebase/firestore';
import {COLLECTION} from 'app/store/globalStore';
import {Notification} from './notification.type';
import {useQuery} from '@tanstack/react-query';
import useAuthStore from 'app/store/authStore';
import moment from 'moment';

export const getAccessToken = async () => {
  const HOST = '192.168.1.216';
  try {
    const response = await axios.get(`http://${HOST}:3000/access-token`);
    return response.data.access_token;
  } catch (error) {
    console.error('Error fetching access token:', error);
    throw error;
  }
};

interface NotificationParams {
  topics: string[];
  title: string;
  body: string;
  data?: any;
}

export const sendNotification = async ({
  body,
  title,
  topics,
  data,
}: NotificationParams) => {
  const token = await getAccessToken();

  const message = {
    message: {
      notification: {
        title: title,
        body: body,
      },
      data: data,
      condition: topics.map(topic => `'${topic}' in topics`).join(' || '),
    },
  };

  const response = await fetch(
    'https://fcm.googleapis.com//v1/projects/funchat-social-media/messages:send',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(message),
      redirect: 'follow',
    },
  );
  if (!response.ok) {
    const error = await response.json();
    throw error;
  } else {
    const notification_doc = firestore()
      .collection(COLLECTION.NOTIFICATIONS)
      .doc();

    notification_doc.set({
      id: notification_doc.id,
      topics,
      title,
      body,
      data: data || {},
      seen: false,
      time: new Date().toISOString(),
    });
  }
};

export const useGetNotifications = () => {
  const userId = useAuthStore(state => state.user.id);
  return useQuery(['GET-NOTIFICATIONS'], async (): Promise<Notification[]> => {
    const notification_doc = firestore().collection(COLLECTION.NOTIFICATIONS);
    try {
      const querySnapshot = await notification_doc
        .where('topics', 'array-contains', userId)
        .get();
      const notifications: Notification[] = [];
      querySnapshot.forEach(documentSnapshot => {
        notifications.push(documentSnapshot.data() as Notification);
      });
      return notifications.sort((a, b) => moment(b.time).diff(moment(a.time)));
    } catch (error) {
      throw error;
    }
  });
};

export const updateSeenNotification = async (notificationId: string) => {
  const notification_doc = firestore()
    .collection(COLLECTION.NOTIFICATIONS)
    .doc(notificationId);
  await notification_doc.update({seen: true});
};

export const deleteNotification = async (notificationId: string) => {
  const notification_doc = firestore()
    .collection(COLLECTION.NOTIFICATIONS)
    .doc(notificationId);
  await notification_doc.delete();
};
