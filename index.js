/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import notifee from '@notifee/react-native';
import {handlePushEvent} from 'app/hook/useFirebaseNotification';
import {setPushConfig} from 'app/utils/setPushConfig';

notifee.onBackgroundEvent(handlePushEvent);
setPushConfig();
AppRegistry.registerComponent(appName, () => App);
