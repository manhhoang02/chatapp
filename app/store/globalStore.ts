import {create} from 'zustand';

type State = {
  isFirstTime: boolean;
  dispatchIsFirstTime: (p: boolean) => void;
};

export const useGlobalStore = create<State>(set => ({
  isFirstTime: true,
  dispatchIsFirstTime: p => set({isFirstTime: p}),
}));
