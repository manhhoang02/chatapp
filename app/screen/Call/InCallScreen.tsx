import React from 'react';
import {StyleSheet, View} from 'react-native';
import {
  CallContent,
  StreamCall,
  useStreamVideoClient,
} from '@stream-io/video-react-native-sdk';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {ParamsStack} from 'app/navigation/params';
import CustomCallControls from './components/CustomCallControls';

export default function ({
  navigation,
}: NativeStackScreenProps<ParamsStack, 'InCallScreen'>) {
  const client = useStreamVideoClient();
  const onHangupCallHandler = () => {
    navigation.goBack();
  };

  const callId = 'default_9075454d-05e9-4115-a182-a10339b0b330';

  if (!client) {
    return null;
  }

  const call = client.call('default', callId);
  call.join({create: true});

  return (
    <StreamCall call={call}>
      <View style={styles.container}>
        <CallContent
          onHangupCallHandler={onHangupCallHandler}
          CallControls={CustomCallControls}
        />
      </View>
    </StreamCall>
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
