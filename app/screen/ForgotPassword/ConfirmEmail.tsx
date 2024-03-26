import {
  showToastMessageError,
  showToastMessageInfo,
} from '@abong.code/helpers/messageHelper';
import color from '@abong.code/theme/color';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useSendOTP} from 'app/api/auth';
import AppContainer from 'app/components/Global/AppContainer';
import {ParamsAuth} from 'app/navigation/params';
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
import LinearGradient from 'react-native-linear-gradient';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function () {
  const navigation = useNavigation<NativeStackNavigationProp<ParamsAuth>>();
  const insets = useSafeAreaInsets();

  const [email, setEmail] = useState('manhkuma@gmail.com');
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
    <AppContainer>
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        style={[AppStyles.grow, {paddingTop: 20 + insets.top}, styles.scroll]}>
        <TouchableOpacity
          style={styles.mb20}
          onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back-outline" size={24} color={color.white} />
        </TouchableOpacity>

        <Text style={[styles.title, styles.mb20]}>Forgot password?</Text>

        <Text style={styles.desc}>
          Enter your email and we’ll send you the{'\n'}instructions on how to
          reset your password.
        </Text>

        <View>
          <TextInput
            placeholder="Enter your email address"
            placeholderTextColor="#EBE2F8"
            style={styles.textInput}
            value={email}
            onChangeText={setEmail}
            inputMode="email"
          />
          <LinearGradient
            colors={['#4935A5', '#CA99EB', '#CFCCD7']}
            start={{x: 0.0, y: 0.5}}
            end={{x: 0.6, y: 0.5}}
            locations={[0, 0.8, 1]}
            style={styles.line}
          />
        </View>

        <TouchableOpacity
          onPress={handleConfirm}
          disabled={!email}
          style={[styles.btn, !email && styles.disabled]}>
          <Text style={styles.btnText}>Recover Password</Text>
        </TouchableOpacity>
      </KeyboardAwareScrollView>
    </AppContainer>
  );
}

const styles = StyleSheet.create({
  disabled: {opacity: 0.7},
  btnText: {fontSize: 22, color: 'white', fontWeight: 'bold'},
  btn: {
    height: 51,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
    marginTop: 65,
    backgroundColor: '#635A8F',
  },
  textInput: {
    fontSize: 15,
    height: 44,
    color: color.white,
    fontWeight: '500',
  },
  line: {height: 3, width: '100%'},
  desc: {
    fontSize: 15,
    color: color.white,
    fontWeight: '500',
    lineHeight: 26.5,
    marginBottom: 32,
  },
  title: {fontSize: 30, color: color.white, fontWeight: 'bold'},
  scroll: {paddingHorizontal: 32},
  mb20: {marginBottom: 20},
});
