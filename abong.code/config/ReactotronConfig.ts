import Reactotron from 'reactotron-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

Reactotron.setAsyncStorageHandler(AsyncStorage)
  .configure({name: 'Fun Chat'}) // controls connection & communication settings
  .useReactNative() // add all built-in react native plugins
  .connect(); // let's connect!
