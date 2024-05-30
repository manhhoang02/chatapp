import React from 'react';
import {StyleSheet, View} from 'react-native';
import {
  CallingState,
  IncomingCall,
  OutgoingCall,
  StreamCall,
  useCalls,
} from '@stream-io/video-react-native-sdk';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {ParamsStack} from 'app/navigation/params';
import {consoleLog} from '@abong.code/helpers/logHelper';

export default function ({
  navigation,
}: NativeStackScreenProps<ParamsStack, 'CallScreen'>) {
  const calls = useCalls();
  const streamCall = calls[0];

  const onRejectCallHandler = () => {
    navigation.goBack();
  };

  let callUI = null;

  // handle incoming ring calls
  const incomingCalls = calls.filter(
    call =>
      call.isCreatedByMe === false &&
      call.state.callingState === CallingState.RINGING,
  );

  const [incomingCall] = incomingCalls;
  if (incomingCall) {
    // render the incoming call UI
    callUI = <IncomingCall onRejectCallHandler={onRejectCallHandler} />;
  }

  // handle outgoing ring calls
  const outgoingCalls = calls.filter(
    call =>
      call.isCreatedByMe === true &&
      call.state.callingState === CallingState.RINGING,
  );

  const [outgoingCall] = outgoingCalls;
  if (outgoingCall) {
    // render the outgoing call UI
    callUI = <OutgoingCall onHangupCallHandler={onRejectCallHandler} />;
  }

  // Wrap the call UI in a StreamCall component
  if (streamCall) {
    callUI = <StreamCall call={streamCall}>{callUI}</StreamCall>;
  }

  consoleLog(calls, 'callUI');

  return (
    // <StreamCall call={streamCall}>
    <View style={styles.container}>{callUI}</View>
    // </StreamCall>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    textAlign: 'center',
  },
});
