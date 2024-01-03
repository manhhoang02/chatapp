import React from 'react';
import AppConstant, {appSize} from '@abong.code/config/AppConstant';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import Modal from 'react-native-modal';
import color from '@abong.code/theme/color';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useAppContext, UserProfileType} from '@abong.code/context/AppProvider';
import {logout} from 'app/api/auth';
import auth from '@react-native-firebase/auth';
import {consoleLog} from '@abong.code/helpers/logHelper';

type Props = {
  isVisible: boolean;
  onClose: () => void;
};
export default function ({isVisible, onClose}: Props) {
  const {setUser} = useAppContext();
  const handleLogOut = async () => {
    auth()
      .signOut()
      .then(() => consoleLog(auth().currentUser, 'hihi-logout'));

    const fcmToken = await AsyncStorage.getItem(AppConstant.SESSION.FCM_TOKEN);
    if (fcmToken) {
      await logout(fcmToken);
    }
    AsyncStorage.removeItem(AppConstant.SESSION.TOKEN);
    setUser({} as UserProfileType);
  };

  return (
    <Modal
      animationIn={'fadeIn'}
      animationOut={'fadeOut'}
      animationInTiming={300}
      animationOutTiming={300}
      isVisible={isVisible}
      backdropColor={color.black04}
      style={[styles.modal, styles.noMargin]}
      //   onBackdropPress={onClose}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Đăng xuất khỏi tài khoản của bạn?</Text>
        <View style={styles.contentBtn}>
          <TouchableOpacity
            style={[
              styles.btn,
              {borderRightWidth: appSize(0.4), borderColor: color.primary},
            ]}
            onPress={onClose}>
            <Text style={{color: color.primary}}>Huỷ</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btn} onPress={handleLogOut}>
            <Text style={styles.textLogOut}>Đăng xuất</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '60%',
    borderColor: color.black04,
    borderRadius: appSize(10),
    backgroundColor: color.white,
  },
  noMargin: {
    marginHorizontal: 0,
    marginVertical: 0,
  },
  modal: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentBtn: {
    flexDirection: 'row',
    borderTopWidth: appSize(0.4),
    borderColor: color.primary,
  },
  title: {
    fontSize: appSize(16),
    fontWeight: 'bold',
    textAlign: 'center',
    marginHorizontal: appSize(10),
    marginVertical: appSize(10),
  },
  btn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: appSize(8),
  },
  textLogOut: {
    color: color.danger,
    fontWeight: '400',
  },
});
