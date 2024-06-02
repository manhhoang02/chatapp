if (__DEV__) {
  import('./abong.code/config/ReactotronConfig');
}

import React, {useEffect} from 'react';
import AppNavigation from 'app/navigation/AppNavigation';
import AppProvider from '@abong.code/context/AppProvider';
import 'react-native-gesture-handler';
import {StatusBar} from 'react-native';
import moment from 'moment';

import AsyncStorage from '@react-native-async-storage/async-storage';
import SplashScreen from 'app/screen/Splash/SplashScreen';
import {useGlobalStore} from 'app/store/globalStore';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import {shallow} from 'zustand/shallow';

moment.locale('vi');
moment.updateLocale('vi', {
  weekdays: ['Chủ Nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'],
});

const App = () => {
  const [isFirstTime, dispatchIsFirstTime] = useGlobalStore(
    s => [s.isFirstTime, s.dispatchIsFirstTime],
    shallow,
  );

  useEffect(() => {
    const checkFirstTime = async () => {
      try {
        const check = await AsyncStorage.getItem('isFirstTime');
        if (check === null) {
          await AsyncStorage.setItem('isFirstTime', 'true');
          dispatchIsFirstTime(true);
        } else {
          dispatchIsFirstTime(false);
        }
      } catch (error) {
        console.log('Error checking first time:', error);
      }
    };

    checkFirstTime();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AppProvider>
      <BottomSheetModalProvider>
        <StatusBar
          barStyle={'dark-content'}
          translucent
          backgroundColor={'transparent'}
        />
        {isFirstTime ? <SplashScreen /> : <AppNavigation />}
      </BottomSheetModalProvider>
    </AppProvider>
  );
};
export default App;
