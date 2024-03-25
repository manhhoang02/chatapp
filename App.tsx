import React from 'react';
import AppNavigation from 'app/navigation/AppNavigation';
import AppProvider from '@abong.code/context/AppProvider';
import 'react-native-gesture-handler';
import {StatusBar} from 'react-native';
import moment from 'moment';
import './abong.code/config/ReactotronConfig.ts';

moment.locale('vi');
moment.updateLocale('vi', {
  weekdays: ['Chủ Nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'],
});

const App = () => {
  return (
    <AppProvider>
      <StatusBar
        barStyle={'dark-content'}
        translucent
        backgroundColor={'transparent'}
      />
      <AppNavigation />
    </AppProvider>
  );
};
export default App;
