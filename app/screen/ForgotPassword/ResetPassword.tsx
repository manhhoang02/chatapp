import {appSize} from '@abong.code/config/AppConstant';
import AppProcessingButton from '@abong.code/elements/AppProcessingButton';
import {
  showToastMessageError,
  showToastMessageSuccess,
} from '@abong.code/helpers/messageHelper';
import color from '@abong.code/theme/color';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useResetPassword} from 'app/api/auth';
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

export default function ({
  route,
  navigation,
}: NativeStackScreenProps<ParamsAuth, 'ResetPassword'>) {
  const {top} = useSafeAreaInsets();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(true);
  const [showConfirmPW, setShowConfirmPW] = useState(true);
  const [processing, setProcessing] = useState(false);

  const {mutate} = useResetPassword();

  const handleChange = () => {
    if (password.length >= 6) {
      if (password !== confirmPassword) {
        showToastMessageError('Lỗi', 'Xác nhận mật khẩu không trùng nhau');
      } else {
        setProcessing(true);
        mutate(
          {
            email: route?.params?.email,
            password,
          },
          {
            onSuccess: () => {
              showToastMessageSuccess(
                'Thành công!',
                'Thay đổi mật khẩu thành công. Vui lòng đăng nhập lại',
              );
              navigation.navigate('Login');
            },
            onError: () => {
              showToastMessageError(
                'Thất bại!',
                'Cài lại mật khẩu không thành công',
              );
            },
            onSettled: () => {
              setTimeout(() => {
                setProcessing(false);
              }, 1500);
            },
          },
        );
      }
    } else {
      showToastMessageError('Lỗi', 'Mật khẩu phải trên 6 ký tự');
    }
  };
  return (
    <View style={[styles.container, {paddingTop: top}]}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.btnBack}
          onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} />
        </TouchableOpacity>
        <Text style={styles.titleHeader}>Cài lại mật khẩu</Text>
      </View>
      <Text style={[styles.text, {marginTop: appSize(30)}]}>Mật khẩu mới</Text>
      <View style={styles.containerTextInput}>
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="Nhập mật khẩu mới"
          autoCapitalize="none"
          style={styles.textInput}
          placeholderTextColor={color.placeholder}
          secureTextEntry={showPassword}
        />
        {showPassword ? (
          <Ionicons
            name="eye"
            size={22}
            onPress={() => {
              setShowPassword(!showPassword);
            }}
          />
        ) : (
          <Ionicons
            name="eye-off"
            size={22}
            onPress={() => {
              setShowPassword(!showPassword);
            }}
          />
        )}
      </View>
      <Text style={[styles.text, {marginTop: appSize(30)}]}>
        Xác nhận mật khẩu mới
      </Text>
      <View style={styles.containerTextInput}>
        <TextInput
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="Xác nhận mật khẩu mới"
          autoCapitalize="none"
          style={styles.textInput}
          placeholderTextColor={color.placeholder}
          secureTextEntry={showConfirmPW}
        />
        {showConfirmPW ? (
          <Ionicons
            name="eye"
            size={22}
            onPress={() => {
              setShowConfirmPW(!showConfirmPW);
            }}
          />
        ) : (
          <Ionicons
            name="eye-off"
            size={22}
            onPress={() => {
              setShowConfirmPW(!showConfirmPW);
            }}
          />
        )}
      </View>
      <AppProcessingButton
        disabled={!password || !confirmPassword}
        processing={processing}
        height={appSize(45)}
        width={appSize(200)}
        text="Xác nhận"
        onPress={handleChange}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: appSize(16),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: appSize(50),
  },
  titleHeader: {
    fontSize: appSize(20),
    fontWeight: 'bold',
    color: color.black,
  },
  btnBack: {
    position: 'absolute',
    left: 0,
  },
  text: {
    fontSize: appSize(16),
    fontWeight: '600',
    marginLeft: appSize(5),
  },
  containerTextInput: {
    borderBottomWidth: appSize(0.3),
    borderColor: color.black,
    flexDirection: 'row',
    alignItems: 'center',
  },
  textInput: {
    padding: appSize(10),
    flex: 1,
  },
});
