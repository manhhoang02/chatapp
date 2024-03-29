import AppProcessingButton from '@abong.code/elements/AppProcessingButton';
import {
  showToastMessageError,
  showToastMessageSuccess,
} from '@abong.code/helpers/messageHelper';
import color from '@abong.code/theme/color';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AppText} from '@starlingtech/element';
import {useResetPassword} from 'app/api/auth';
import AppContainer from 'app/components/Global/AppContainer';
import {ParamsAuth} from 'app/navigation/params';
import IconEye from 'assets/icons/IconEye';
import AppStyles from 'elements/AppStyles';
import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function ({
  route,
  navigation,
}: NativeStackScreenProps<ParamsAuth, 'ResetPassword'>) {
  const insets = useSafeAreaInsets();

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
    <AppContainer>
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        style={[AppStyles.grow, {paddingTop: 21 + insets.top}, styles.scroll]}>
        <TouchableOpacity
          style={styles.mb20}
          onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back-outline" size={24} color={color.primary} />
        </TouchableOpacity>

        <Text style={styles.resetText}>Tạo mật khẩu mới</Text>

        <AppText style={styles.text}>Nhập mật khẩu mới</AppText>
        <View style={styles.mb20}>
          <TextInput
            placeholder="Mật khẩu mới"
            placeholderTextColor={color.primary}
            style={styles.textInput}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={showPassword}
          />
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.iconEyeBtn}>
            <IconEye hide={showPassword} />
          </TouchableOpacity>
        </View>

        <AppText style={styles.text}>Nhập lại mật khẩu mới</AppText>
        <View style={styles.mb20}>
          <TextInput
            placeholder="Xác nhận mật khẩu mới"
            placeholderTextColor={color.primary}
            style={styles.textInput}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={showConfirmPW}
          />
          <TouchableOpacity
            onPress={() => setShowConfirmPW(!showConfirmPW)}
            style={styles.iconEyeBtn}>
            <IconEye hide={showConfirmPW} color={color.primary} />
          </TouchableOpacity>
        </View>

        <AppProcessingButton
          disabled={!password || !confirmPassword}
          processing={processing}
          height={51}
          text="Xác nhận"
          width={326}
          backgroundColor="#635A8F"
          onPress={handleChange}
        />
      </KeyboardAwareScrollView>
    </AppContainer>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 17,
    color: color.primary,
    fontWeight: '500',
    marginBottom: 8,
  },
  iconEyeBtn: {position: 'absolute', right: 20, top: 14.5, bottom: 14.5},
  mb20: {marginBottom: 20},
  textInput: {
    height: 53,
    flex: 1,
    borderWidth: 3,
    borderColor: color.primary,
    borderRadius: 25,
    paddingLeft: 20,
    fontSize: 17,
    fontWeight: '500',
    color: color.primary,
    justifyContent: 'center',
  },
  resetText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: color.primary,
    marginBottom: 36,
  },
  scroll: {paddingHorizontal: 32, backgroundColor: color.white},
});
