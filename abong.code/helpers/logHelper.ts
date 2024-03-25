import Reactotron from 'reactotron-react-native';

export const consoleLog = (str1: any, ...str2: any) => {
  if (str2) {
    Reactotron.log(str1, ...str2);
  } else {
    Reactotron.log(...str1);
  }
};
