if (__DEV__) {
  import('./abong.code/config/ReactotronConfig').then(() =>
    console.log('Reactotron Configured'),
  );
}

import React, {useEffect, useState} from 'react';
import AppNavigation from 'app/navigation/AppNavigation';
import AppProvider from '@abong.code/context/AppProvider';
import 'react-native-gesture-handler';
import {ActivityIndicator, StatusBar, View} from 'react-native';
import moment from 'moment';

import AsyncStorage from '@react-native-async-storage/async-storage';
import SplashScreen from 'app/screen/Splash/SplashScreen';
import AppStyles from 'elements/AppStyles';
import color from '@abong.code/theme/color';
import {useGlobalStore} from 'app/store/globalStore';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';

moment.locale('vi');
moment.updateLocale('vi', {
  weekdays: ['Chủ Nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'],
});

const App = () => {
  const [isFirstTime, dispatchIsFirstTime] = useGlobalStore(s => [
    s.isFirstTime,
    s.dispatchIsFirstTime,
  ]);

  const [isLoading, setIsLoading] = useState(true);

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
        setIsLoading(false);
      } catch (error) {
        console.log('Error checking first time:', error);
        setIsLoading(false);
      }
    };

    checkFirstTime();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading) {
    return (
      <View style={[AppStyles.center, AppStyles.fill]}>
        <ActivityIndicator color={color.primary} />
      </View>
    );
  }

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
