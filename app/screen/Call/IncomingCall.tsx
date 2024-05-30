import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {
  Call,
  CallingState,
  IncomingCall,
  StreamCall,
  useCallStateHooks,
  useCalls,
} from '@stream-io/video-react-native-sdk';

const CallPanel = ({call}: {call: Call}) => {
  const {useCallCallingState} = useCallStateHooks();
  const callingState = useCallCallingState();

  // Display the incoming call if the call state is RINGING and the call is not created
  if (callingState === CallingState.RINGING && !call.isCreatedByMe) {
    return <IncomingCall />;
  }

  return null;
};
export default function IncomingCallScreen() {
  const calls = useCalls();
  const call = calls[0];
  if (!call) {
    return (
      <View style={styles.container}>
        <Text>No incoming call</Text>
      </View>
    );
  }

  return (
    <StreamCall call={call}>
      <CallPanel call={call} />
    </StreamCall>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
