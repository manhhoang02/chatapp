import React, {createContext, useContext} from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import Toast, {
  BaseToast,
  ErrorToast,
  SuccessToast,
} from 'react-native-toast-message';
import color from '@abong.code/theme/color';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import AppStyles from 'elements/AppStyles';

const queryClient = new QueryClient();

type AppContextType = {};
const AppContext = createContext({} as AppContextType);

export const useAppContext = () => useContext(AppContext);

const AppProvider = ({children}: any) => {
  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={AppStyles.fill}>
        <QueryClientProvider client={queryClient}>
          <AppContext.Provider value={{}}>{children}</AppContext.Provider>
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
