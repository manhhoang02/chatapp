import {appSize} from '@abong.code/config/AppConstant';
import color from '@abong.code/theme/color';
import Toast from 'react-native-toast-message';

export const showToastMessageSuccess = (title?: string, mes?: string) => {
  Toast.show({
    type: 'success',
    text1: title || 'Success',
    text2: mes,
    position: 'top',
    props: {
      text1Style: {
        fontSize: appSize(15),
        fontWeight: 'bold',
        color: color.success,
      },
      text2Style: {
        fontSize: appSize(14),
      },
    },
  });
};

export const showToastMessageError = (title?: string, mes?: string) => {
  Toast.show({
    type: 'error',
    text1: title || 'Error',
    text2: mes,
    position: 'top',
    props: {
      text1Style: {
        fontSize: appSize(15),
        fontWeight: 'bold',
        color: color.danger,
      },
      text2Style: {
        fontSize: appSize(14),
      },
    },
  });
};

export const showToastMessageInfo = (title?: string, mes?: string) => {
  Toast.show({
    type: 'info',
    text1: title || 'Info',
    text2: mes,
    position: 'top',
    props: {
      text1Style: {
        fontSize: appSize(15),
        fontWeight: 'bold',
      },
      text2Style: {
        fontSize: appSize(14),
      },
    },
  });
};
