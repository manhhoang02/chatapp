import {StyleSheet, View} from 'react-native';
import React from 'react';
import {
  CallControlProps,
  useCallStateHooks,
  HangUpCallButton,
  ToggleAudioPublishingButton as ToggleMic,
  ToggleVideoPublishingButton as ToggleCamera,
} from '@stream-io/video-react-native-sdk';
import color from '@abong.code/theme/color';

export default function CustomCallControls(props: CallControlProps) {
  const {useCameraState, useMicrophoneState} = useCallStateHooks();
  const {camera} = useCameraState();
  const {microphone} = useMicrophoneState();

  return (
    <View style={styles.customCallControlsContainer}>
      <ToggleMic onPressHandler={() => microphone.toggle()} />
      <ToggleCamera onPressHandler={() => camera.toggle()} />
      <HangUpCallButton onHangupCallHandler={props.onHangupCallHandler} />
    </View>
  );
}

const styles = StyleSheet.create({
  customCallControlsContainer: {
    position: 'absolute',
    bottom: 40,
    paddingVertical: 10,
    width: '80%',
    marginHorizontal: 20,
    flexDirection: 'row',
    alignSelf: 'center',
    justifyContent: 'space-around',
    backgroundColor: color.primary,
    borderRadius: 10,
    borderColor: 'black',
    borderWidth: 5,
    zIndex: 5,
  },
});
