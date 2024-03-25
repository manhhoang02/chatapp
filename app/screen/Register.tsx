import {appSize} from '@abong.code/config/AppConstant';
import color from '@abong.code/theme/color';
import {useRegister} from 'app/api/auth';
import React, {useState} from 'react';
import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import {TextInput} from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AppProcessingButton from '@abong.code/elements/AppProcessingButton';
import {useNavigation} from '@react-navigation/native';
import {ParamsAuth} from 'app/navigation/params';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {
  showToastMessageError,
  showToastMessageSuccess,
} from '@abong.code/helpers/messageHelper';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

export default function () {
  const {top} = useSafeAreaInsets();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(true);
  const [showConfirmPW, setShowConfirmPW] = useState(true);
  const [processing, setProcessing] = useState(false);

  const {mutate} = useRegister();

  const navigation = useNavigation<NativeStackNavigationProp<ParamsAuth>>();

  const handleRegister = () => {
    setProcessing(true);
    if (password === confirmPassword) {
      mutate(
        {
          first_name: firstName,
          last_name: lastName,
          email,
          password,
        },
        {
          onSuccess: data => {
            setProcessing(false);
            if (data && !data.success) {
              showToastMessageError('Thất bại', 'Email đã được đăng ký');
              return;
            }
            navigation.navigate('Login');
            showToastMessageSuccess(
              'Thành công',
              'Đăng ký tài khoản thành công!',
            );
          },
          onError: () => {
            setProcessing(false);
            showToastMessageError('Thất bại', 'Đăng ký tài khoản thất bại');
          },
          onSettled: () => {
            setTimeout(() => {
              setProcessing(false);
            }, 1500);
          },
        },
      );
    } else {
      showToastMessageError('Thất bại', 'Xác nhận mật khẩu không chính xác');
      setTimeout(() => {
        setProcessing(false);
      }, 1000);
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, {marginTop: top}]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} />
        </TouchableOpacity>
      </View>
      <View style={styles.boxForm}>
        <Image
          source={require('assets/image/logo_app.png')}
          style={styles.logo}
          resizeMode="stretch"
        />
        <View style={styles.row}>
          <TextInput
            label={'Họ'}
            value={firstName}
            onChangeText={setFirstName}
            mode="outlined"
            outlineColor={color.border}
            activeOutlineColor={color.primary}
            textColor={color.primary}
            style={[styles.textInput, styles.flex, {marginRight: appSize(10)}]}
            autoCapitalize="none"
          />
          <TextInput
            label={'Tên'}
            value={lastName}
            onChangeText={setLastName}
            mode="outlined"
            outlineColor={color.border}
            activeOutlineColor={color.primary}
            textColor={color.primary}
            style={[styles.textInput, styles.flex]}
            autoCapitalize="none"
          />
        </View>
        <TextInput
          label={'Email'}
          value={email}
          onChangeText={setEmail}
          mode="outlined"
          outlineColor={color.border}
          activeOutlineColor={color.primary}
          textColor={color.primary}
          style={styles.textInput}
          autoCapitalize="none"
        />
        <TextInput
          autoCapitalize="none"
          style={styles.textInput}
          label={'Mật khẩu'}
          value={password}
          onChangeText={setPassword}
          mode="outlined"
          outlineColor={color.border}
          activeOutlineColor={color.primary}
          textColor={color.primary}
          secureTextEntry={showPassword}
          right={
            password ? (
              <TextInput.Icon
                icon={showPassword ? 'eye' : 'eye-off'}
                size={20}
                onPress={() => setShowPassword(!showPassword)}
              />
            ) : null
          }
        />
        <TextInput
          autoCapitalize="none"
          style={styles.textInput}
          label={'Xác nhận mật khẩu'}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          mode="outlined"
          outlineColor={color.border}
          activeOutlineColor={color.primary}
          textColor={color.primary}
          secureTextEntry={showConfirmPW}
          right={
            confirmPassword ? (
              <TextInput.Icon
                icon={showConfirmPW ? 'eye' : 'eye-off'}
                size={20}
                onPress={() => setShowConfirmPW(!showConfirmPW)}
              />
            ) : null
          }
        />

        <AppProcessingButton
          disabled={
            !email || !password || !confirmPassword || !firstName || !lastName
          }
          processing={processing}
          height={appSize(45)}
          width={appSize(200)}
          text="Đăng ký"
          onPress={handleRegister}
        />
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.white,
    justifyContent: 'center',
  },
  boxForm: {
    marginHorizontal: appSize(16),
  },
  logo: {
    height: appSize(120),
    width: appSize(250),
    alignSelf: 'center',
    marginBottom: appSize(30),
  },
  textInput: {
    justifyContent: 'center',
    marginBottom: appSize(10),
  },
  btnForgot: {
    flexDirection: 'row',
    marginLeft: appSize(5),
  },
  textForgot: {
    color: color.primary,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: appSize(50),
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  flex: {flex: 1},
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: appSize(16),
  },
});
