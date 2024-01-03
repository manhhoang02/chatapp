import {appSize} from '@abong.code/config/AppConstant';
import {useAppContext} from '@abong.code/context/AppProvider';
import color from '@abong.code/theme/color';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import Header from 'app/components/Header';
import {ParamsStack} from 'app/navigation/params';
import React, {useState} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import BtnAction from './container/BtnAction';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ModalLogOut from 'app/components/modals/ModalLogOut';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

export default function () {
  const navigation =
    useNavigation<NativeStackNavigationProp<ParamsStack, 'TabScreen'>>();
  const {user} = useAppContext();
  const {bottom} = useSafeAreaInsets();
  const [isVisible, setIsVisible] = useState(false);
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.infor}>
          <TouchableOpacity
            style={styles.btnInfor}
            onPress={() => {
              navigation.navigate('Profile', {id: user._id});
            }}>
            <Image
              source={
                user?.avatar
                  ? {uri: user?.avatar}
                  : require('assets/image/profile.png')
              }
              style={styles.avatar}
            />
            <View style={styles.contentName}>
              <Text style={styles.textName}>
                {user.first_name + ' ' + user.last_name}
              </Text>
              <Text
                style={{
                  fontSize: appSize(13),
                  color: color.black04,
                  marginTop: appSize(3),
                }}>
                Xem trang cá nhân
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        <BtnAction
          icon={<FontAwesome name="lock" size={24} color={color.black} />}
          text={'Đổi mật khẩu'}
        />
        <BtnAction
          icon={<Ionicons name="settings" size={24} color={color.black} />}
          text={'Cài đặt'}
        />
        <BtnAction
          icon={
            <FontAwesome5
              name="hand-holding-heart"
              size={24}
              color={color.black}
            />
          }
          text={'Thông tin & nguồn lực cho cộng đồng'}
        />
        <BtnAction
          icon={<Ionicons name="help-circle" size={24} color={color.black} />}
          text={'Trợ giúp & hỗ trợ'}
        />
      </View>
      <Header title="Menu" />
      <ModalLogOut
        onClose={() => {
          setIsVisible(false);
        }}
        isVisible={isVisible}
      />
      <View style={styles.bottom}>
        <TouchableOpacity
          style={[
            styles.btnLogOut,
            {marginBottom: appSize(54) + (bottom || appSize(9)) + appSize(40)},
          ]}
          onPress={() => setIsVisible(true)}>
          <Text style={{color: color.black}}>Đăng xuất</Text>
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
  content: {
    paddingTop: appSize(110),
  },
  infor: {
    paddingBottom: appSize(10),
    borderBottomWidth: appSize(0.5),
    borderColor: color.disabled,
    marginBottom: appSize(20),
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
    fontSize: appSize(15),
    fontWeight: '600',
    color: color.black,
  },
  btnLogOut: {
    backgroundColor: color.border,
    alignItems: 'center',
    paddingVertical: appSize(10),
    // marginTop: appSize(150),
    borderRadius: appSize(5),
  },
  bottom: {
    flex: 1,
    justifyContent: 'flex-end',
  },
});
