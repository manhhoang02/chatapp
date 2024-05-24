import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import color from '@abong.code/theme/color';
import {AppBlock, AppText, appSize} from '@starlingtech/element';
import moment from 'moment';
import AppStyles from 'elements/AppStyles';

export default function Notifications() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Thông báo</Text>
      <AppBlock
        style={{
          borderWidth: StyleSheet.hairlineWidth,
          borderRadius: 8,
          paddingVertical: 8,
          paddingHorizontal: 12,
        }}>
        <AppText weight="700">Test thong bao</AppText>
        <AppBlock style={AppStyles.rowCenterBetween}>
          <AppText size={13} color="backdrop">
            abcabc
          </AppText>
          <AppText size={11}>{moment().locale('vi').fromNow(true)}</AppText>
        </AppBlock>
      </AppBlock>
      {/* <AppBlock flex center>
        <AppText size={50}>🤷‍♂️</AppText>
        <Text style={styles.titleEmpty}>Không có thông báo để hiển thị.</Text>
      </AppBlock> */}
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
