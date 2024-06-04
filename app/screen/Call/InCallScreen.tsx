import React, {useEffect} from 'react';
import {useCalls} from '@stream-io/video-react-native-sdk';
import CallScreen from './CallScreen';
import {useNavigation} from '@react-navigation/native';

export default function InCallScreen() {
  const {goBack} = useNavigation();
  const calls = useCalls();
  const firstCall = calls[0];

  const run = async () => {
    // await firstCall.leave();
    await firstCall.endCall();
    goBack();
  };

  useEffect(() => {
    if (!firstCall) {
      run();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firstCall]);

  return <CallScreen />;
}
