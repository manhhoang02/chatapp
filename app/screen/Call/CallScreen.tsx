import React, {useCallback, useEffect} from 'react';
import {Alert, SafeAreaView, StyleSheet} from 'react-native';
import {
  Call,
  CallingState,
  RingingCallContent,
  StreamCall,
  useCalls,
} from '@stream-io/video-react-native-sdk';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

export default function () {
  const {top} = useSafeAreaInsets();
  const calls = useCalls();

  const handleMoreCalls = useCallback(async () => {
    const lastCallCreatedBy = calls[1]?.state.createdBy;
    Alert.alert(
      `Incoming call from ${
        lastCallCreatedBy?.name ?? lastCallCreatedBy?.id
      }, only 1 call at a time is supported`,
    );
  }, [calls]);

  // Reset the state of the show variable when there are no calls.
  useEffect(() => {
    if (calls.length > 1) {
      handleMoreCalls();
    }
  }, [calls.length, handleMoreCalls]);

  const firstCall = calls[0];

  if (!firstCall) {
    return null;
  }

  return (
    <StreamCall call={firstCall}>
      <CallLeaveOnUnmount call={firstCall} />
      <SafeAreaView style={[styles.container, {top}]}>
        <RingingCallContent />
      </SafeAreaView>
    </StreamCall>
  );
}

const CallLeaveOnUnmount = ({call}: {call: Call}) => {
  useEffect(() => {
    return () => {
      if (call && call.state.callingState !== CallingState.LEFT) {
        call.leave();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
};

const styles = StyleSheet.create({
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  container: {
    ...StyleSheet.absoluteFillObject,
  },
});
