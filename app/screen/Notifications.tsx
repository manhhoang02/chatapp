import {Button, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import color from '@abong.code/theme/color';
import {AppBlock, AppText, appSize} from '@starlingtech/element';
import {utils} from '@react-native-firebase/app';
import storage from '@react-native-firebase/storage';

export default function Notifications() {
  const reference = storage().ref('black-t-shirt-sm.png');
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Thông báo</Text>
      <Button
        title="abc"
        onPress={async () => {
          // path to existing file on filesystem
          const pathToFile = `${utils.FilePath.PICTURES_DIRECTORY}/black-t-shirt-sm.png`;
          // uploads file
          await reference.putFile(pathToFile);
        }}
      />
      <AppBlock flex center>
        <AppText size={50}>🤷‍♂️</AppText>
        <Text style={styles.titleEmpty}>Không có thông báo để hiển thị.</Text>
      </AppBlock>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: color.primary,
    marginVertical: 10,
  },
  titleEmpty: {
    textAlign: 'center',
    fontSize: appSize(16),
  },
  container: {
    flex: 1,
    paddingHorizontal: 12,
    backgroundColor: color.white,
  },
});
