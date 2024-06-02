/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import messaging from '@react-native-firebase/messaging';
import {displayNotification} from 'app/hook/useFirebaseNotification';
import {setPushConfig} from 'app/utils/setPushConfig';

messaging().setBackgroundMessageHandler(displayNotification);

setPushConfig();
AppRegistry.registerComponent(appName, () => App);
