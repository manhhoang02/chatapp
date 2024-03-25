import {name} from 'app.json';
import Reactotron from 'reactotron-react-native';

Reactotron.configure({
  name,
}).useReactNative(); // add all built-in react native plugins

Reactotron.connect();
