import React from 'react';

import {name} from 'app.json';
import Reactotron, {asyncStorage} from 'reactotron-react-native';
import {NativeModules} from 'react-native';

const host = NativeModules.SourceCode.scriptURL.split('://')[1].split(':')[0];

export default function () {
  React.useEffect(() => {
    Reactotron.configure({
      name,
      host,
    })
      // .configure() // controls connection & communication settings
      .useReactNative(); // add all built-in react native plugins
    // .connect(); // let's connect!

    Reactotron.use(asyncStorage({}));

    Reactotron.connect();
  }, []);
  return null;
}
