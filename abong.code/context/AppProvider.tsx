import {ResUser} from 'app/api/auth.type';
import initSocket from 'app/utils/socketService';
import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from 'react';
import {Socket} from 'socket.io-client';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import ReactotronConfig from 'abong.code/config/ReactotronConfig';
import Toast, {
  BaseToast,
  ErrorToast,
  SuccessToast,
} from 'react-native-toast-message';
import color from '@abong.code/theme/color';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

const queryClient = new QueryClient();

export interface UserProfileType extends ResUser {
  token: string;
}
export type SyncDataType = {
  chats: number;
  friends: number;
};
type AppContextType = {
  user: UserProfileType;
  setUser: Dispatch<SetStateAction<UserProfileType>>;
  socket: Socket;
  syncData: SyncDataType;
  dispatchSyncData: (p: SyncDataType) => void;
  showModalCallVideo: boolean;
  setShowModalCallVideo: Dispatch<SetStateAction<boolean>>;
};
const AppContext = createContext({} as AppContextType);

export const useAppContext = () => useContext(AppContext);

const socket = initSocket();

const AppProvider = ({children}: any) => {
  const [user, setUser] = useState<UserProfileType>({} as UserProfileType);
  const [showModalCallVideo, setShowModalCallVideo] = useState(false);
  const [syncData, dispatchSyncData] = useState<SyncDataType>(
    {} as SyncDataType,
  );
  useEffect(() => {
    if (user._id) {
      socket.emit('setup', user);
    }
  }, [user]);

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{flex: 1}}>
        <ReactotronConfig />
        <QueryClientProvider client={queryClient}>
          <AppContext.Provider
            value={{
              socket,
              user,
              setUser,
              syncData,
              dispatchSyncData,
              showModalCallVideo,
              setShowModalCallVideo,
            }}>
            {children}
          </AppContext.Provider>
        </QueryClientProvider>
        <Toast config={toastConfig} />
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
};
export default AppProvider;

const toastConfig = {
  // <Toast> must at the end line
  success: (props: any) => (
    <SuccessToast
      {...props}
      text1Style={props.props.text1Style}
      text2Style={props.props.text2Style}
      text2NumberOfLines={2}
    />
  ),
  error: (props: any) => (
    <ErrorToast
      {...props}
      text1Style={props.props.text1Style}
      text2Style={props.props.text2Style}
      text2NumberOfLines={2}
    />
  ),
  info: (props: any) => (
    <BaseToast
      {...props}
      style={{borderLeftColor: color.warning}}
      text1Style={props.props.text1Style}
      text2Style={props.props.text2Style}
      text2NumberOfLines={2}
    />
  ),
};
