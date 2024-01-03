import {appSize} from '@abong.code/config/AppConstant';
import {
  showToastMessageError,
  showToastMessageInfo,
} from '@abong.code/helpers/messageHelper';
import color from '@abong.code/theme/color';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useSendOTP} from 'app/api/auth';
import {ParamsAuth} from 'app/navigation/params';
import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function () {
  const navigation = useNavigation<NativeStackNavigationProp<ParamsAuth>>();
  const {top} = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const {mutate} = useSendOTP();
  const validateEmail = (inputEmail: string) => {
    return inputEmail.match(
      // eslint-disable-next-line no-useless-escape
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    );
  };

  const handleConfirm = () => {
    if (validateEmail(email)) {
      showToastMessageInfo('Đang xử lý', 'Vui lòng đợi');
      mutate(email, {
        onSuccess: () => {
          navigation.navigate('ConfirmOTP', {email});
        },
        onError: () => {
          showToastMessageError('Thất bại', 'Email chưa được đăng ký sử dụng');
        },
      });
    } else {
      showToastMessageError('Error', 'Chưa đúng định dạng email.');
    }
  };
  return (
    <View style={[styles.container, {paddingTop: top}]}>
      <View style={[styles.header, {marginTop: top}]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} />
        </TouchableOpacity>
      </View>
      <Text style={styles.title}>
        Vui lòng nhập Email tài khoản của bạn để được cấp lại mật khẩu.
      </Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Nhập email"
        autoCapitalize="none"
        style={{
          borderWidth: appSize(1),
          padding: appSize(10),
          borderRadius: appSize(5),
          borderColor: color.primary,
          marginTop: appSize(40),
        }}
        placeholderTextColor={color.placeholder}
      />
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          marginTop: appSize(20),
        }}>
        <TouchableOpacity
          style={[
            styles.btn,
            {backgroundColor: email ? color.primary : color.disabled},
          ]}
          onPress={handleConfirm}>
          <Text style={styles.textBtn}>Xác nhận</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.white,
    justifyContent: 'center',
    paddingHorizontal: appSize(16),
  },
  title: {
    textAlign: 'center',
    fontSize: appSize(15),
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: appSize(16),
  },
  btn: {
    alignItems: 'center',
    justifyContent: 'center',
    width: appSize(150),
    paddingVertical: appSize(10),
    borderRadius: appSize(5),
  },
  textBtn: {
    color: color.white,
    fontWeight: 'bold',
  },
});
