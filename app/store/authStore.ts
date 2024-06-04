import AsyncStorage from '@react-native-async-storage/async-storage';
import {immer} from 'zustand/middleware/immer';
import auth from '@react-native-firebase/auth';
import {createWithEqualityFn} from 'zustand/traditional';
import {Resp_User} from 'app/api/auth.type';

type AuthStore = {
  user: Resp_User;
  dispatchUser: (user: Partial<Resp_User>) => void;
  signOut: () => void;
};

const useAuthStore = createWithEqualityFn<AuthStore>()(
  immer(set => ({
    user: {} as Resp_User,
    dispatchUser: user => set(state => ({user: {...state.user, ...user}})),
    signOut: () =>
      set(state => {
        auth().signOut();
        state.user = {} as Resp_User;
        AsyncStorage.removeItem('id');
      }),
  })),
);

export default useAuthStore;
