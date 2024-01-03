import Reactotron from 'reactotron-react-native';

export const consoleLog = (...str1: any) => {
  Reactotron.log(...str1);
};
