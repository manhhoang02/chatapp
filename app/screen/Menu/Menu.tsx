import AppConstant, {appSize} from '@abong.code/config/AppConstant';
import {UserProfileType, useAppContext} from '@abong.code/context/AppProvider';
import color from '@abong.code/theme/color';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {ParamsStack} from 'app/navigation/params';
import React from 'react';
import {Alert, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import BtnAction from './container/BtnAction';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import LinearAvatar from 'app/components/LinearAvatar';
import light from 'vn.starlingTech/theme/color/light';
import {AppText} from '@starlingtech/element';
import auth from '@react-native-firebase/auth';
import {logout} from 'app/api/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function () {
  const navigation =
    useNavigation<NativeStackNavigationProp<ParamsStack, 'TabScreen'>>();
  const {user, setUser} = useAppContext();
  const {bottom} = useSafeAreaInsets();

  const handleLogout = async () => {
    Alert.alert(
      '',
      'Đăng xuất khỏi tài khoản của bạn?',
      [
        {
          text: 'Hủy',
          onPress: () => console.log('Hủy đăng xuất'),
          style: 'cancel',
        },
        {
          text: 'Đăng xuất',
          onPress: async () => {
            auth().signOut();
            // .then(() => consoleLog(auth().currentUser, 'hihi-logout'));

            const fcmToken = await AsyncStorage.getItem(
              AppConstant.SESSION.FCM_TOKEN,
            );
            if (fcmToken) {
              await logout(fcmToken);
            }
            AsyncStorage.removeItem(AppConstant.SESSION.TOKEN);
            setUser({} as UserProfileType);
          },
        },
      ],
      {cancelable: false},
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Menu</Text>
      <View style={styles.content}>
        <View style={styles.infor}>
          <TouchableOpacity
            style={styles.btnInfor}
            onPress={() => {
              navigation.navigate('Profile', {id: user._id});
            }}>
            <LinearAvatar uri={user.avatar} size={56} disabled />
            <View style={styles.contentName}>
              <Text style={styles.textName}>
                {user.first_name + ' ' + user.last_name}
              </Text>
              <Text
                style={{
                  fontSize: appSize(13),
                  color: light.black_70,
                  marginTop: appSize(3),
                }}>
                Xem trang cá nhân
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        <BtnAction
          icon={
            <Ionicons
              name="lock-closed-outline"
              size={24}
              color={color.primary}
            />
          }
          text={'Đổi mật khẩu'}
        />
        <BtnAction
          icon={
            <Ionicons name="settings-outline" size={24} color={color.primary} />
          }
          text={'Cài đặt'}
        />
        <BtnAction
          icon={
            <Ionicons name="earth-outline" size={24} color={color.primary} />
          }
          text={'Thông tin & nguồn lực cho cộng đồng'}
        />
        <BtnAction
          icon={
            <Ionicons
              name="help-circle-outline"
              size={24}
              color={color.primary}
            />
          }
          text={'Trợ giúp & hỗ trợ'}
        />
      </View>
      <View style={styles.bottom}>
        <TouchableOpacity
          style={[
            styles.btnLogOut,
            {marginBottom: appSize(54) + (bottom || appSize(9)) + appSize(40)},
          ]}
          onPress={handleLogout}>
          <AppText size={16} weight="700">
            Đăng xuất
          </AppText>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.white,
    paddingHorizontal: appSize(16),
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: color.primary,
    marginVertical: 10,
  },
  content: {},
  infor: {
    paddingBottom: appSize(10),
    borderBottomWidth: appSize(0.5),
    borderColor: color.disabled,
  },
  btnInfor: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: appSize(40),
    height: appSize(40),
    borderRadius: appSize(40),
  },
  contentName: {
    marginLeft: appSize(8),
  },
  textName: {
    fontSize: appSize(17),
    fontWeight: '600',
    color: color.primary,
  },
  btnLogOut: {
    backgroundColor: light.light_gray,
    alignItems: 'center',
    paddingVertical: appSize(12),
    borderRadius: appSize(8),
  },
  bottom: {
    flex: 1,
    justifyContent: 'flex-end',
  },
});
