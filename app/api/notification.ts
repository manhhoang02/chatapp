import axios from 'axios';
import firestore from '@react-native-firebase/firestore';
import {COLLECTION} from 'app/store/globalStore';
import {Notification} from './notification.type';
import useAuthStore from 'app/store/authStore';
import {useDataStore} from 'app/store/dataStore';
import moment from 'moment';

export const getAccessToken = async () => {
  // const HOST = '192.168.1.7';
  const API = 'https://server-funchat.onrender.com/access-token';
  try {
    // const response = await axios.get(`http://${HOST}:3000/access-token`);
    const response = await axios.get(API);
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

export function recentlyNotificationListener() {
  const uid = useAuthStore.getState().user.id;
  return firestore()
    .collection(COLLECTION.NOTIFICATIONS)
    .limit(30)
    .where('topics', 'array-contains', uid)
    .onSnapshot(snapshot => {
      const _tempData = snapshot.docs
        .map(item => {
          return item.data();
        })
        .sort((a, b) => moment(b.time).diff(moment(a.time)));

      useDataStore.getState().dispatchRecentlyData({
        notificationData: _tempData as Notification[],
      });
    });
}

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

export const deleteAllNotification = async () => {
  const uid = useAuthStore.getState().user.id;
  const notification_docs = await firestore()
    .collection(COLLECTION.NOTIFICATIONS)
    .where('topics', 'array-contains', uid)
    .get();

  notification_docs.forEach(doc => {
    doc.ref.delete();
  });
};
