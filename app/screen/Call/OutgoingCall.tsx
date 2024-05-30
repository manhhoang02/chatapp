import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {
  Call,
  CallingState,
  OutgoingCall,
  StreamCall,
  useCallStateHooks,
  useCalls,
} from '@stream-io/video-react-native-sdk';

const CallPanel = ({call}: {call: Call}) => {
  const {useCallCallingState} = useCallStateHooks();
  const callingState = useCallCallingState();

  // Display the outgoing call if the call state is RINGING and the call is created by me.
  if (callingState === CallingState.RINGING && call.isCreatedByMe) {
    return <OutgoingCall />;
  }

  return null;
};
export default function OutgoingCallScreen() {
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
