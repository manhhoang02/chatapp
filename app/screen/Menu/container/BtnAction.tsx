import {appSize} from '@abong.code/config/AppConstant';
import color from '@abong.code/theme/color';
import React, {ReactNode} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
type Props = {
  icon: ReactNode;
  text: string;
};
const BtnAction = ({icon, text}: Props) => {
  return (
    <TouchableOpacity style={styles.container}>
      <View style={styles.viewIcon}>{icon}</View>
      <Text style={styles.text}>{text}</Text>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: appSize(15),
    shadowColor: color.black06,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    backgroundColor: color.white,
    marginTop: appSize(20),
    paddingVertical: appSize(15),
    borderRadius: appSize(10),
  },
  text: {
    paddingLeft: appSize(10),
    fontSize: appSize(13),
    color: color.black,
  },
  viewIcon: {
    width: appSize(24),
    height: appSize(24),
    alignItems: 'center',
    justifyContent: 'center',
  },
});
export default BtnAction;
