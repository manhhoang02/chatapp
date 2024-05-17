import Reactotron from 'reactotron-react-native';

export const consoleLog = (str1: any, ...str2: any) => {
  if (str2) {
    Reactotron.log(str1, ...str2);
  } else {
    Reactotron.log(...str1);
  }
};

export const consolelog = (str1: any, ...str2: any) => {
  const json_str1 = JSON.stringify(str1, null, 2);
  const json_str2 = JSON.stringify(str2, null, 2);

  if (str2) {
    console.log(json_str1, json_str2);
  } else {
    console.log(json_str1);
  }
};
