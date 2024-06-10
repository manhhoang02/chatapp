import {
  showToastMessageError,
  showToastMessageInfo,
  showToastMessageSuccess,
} from '@abong.code/helpers/messageHelper';
import color from '@abong.code/theme/color';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
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
import auth from '@react-native-firebase/auth';

interface Props {
  title?: string;
}

export default function ({title}: Props) {
  const navigation = useNavigation<NativeStackNavigationProp<ParamsAuth>>();
  const insets = useSafeAreaInsets();

  const [email, setEmail] = useState('');
  const validateEmail = (inputEmail: string) => {
    return inputEmail.match(
      // eslint-disable-next-line no-useless-escape
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    );
  };

  const handleConfirm = async () => {
    if (validateEmail(email)) {
      showToastMessageInfo('Đang xử lý', 'Vui lòng đợi');
      await auth()
        .sendPasswordResetEmail(email)
        .then(() => {
          showToastMessageSuccess(
            'Thành công',
            'Vui lòng kiểm tra email của bạn.',
          );
        })
        .catch(() => {
          showToastMessageError('Error', 'Có lỗi xảy ra.');
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
          <Ionicons name="arrow-back-outline" size={24} color={color.primary} />
        </TouchableOpacity>

        <Text style={[styles.title, styles.mb20]}>
          {title ?? 'Quên mật khẩu?'}
        </Text>

        <Text style={styles.desc}>
          Nhập email của bạn và chúng tôi sẽ gửi cho bạn{'\n'}hướng dẫn về cách
          Đặt lại mật khẩu của bạn.
        </Text>

        <View>
          <TextInput
            placeholder="Nhập địa chỉ email của bạn"
            placeholderTextColor={color.primary}
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
          <Text style={styles.btnText}>Xác nhận</Text>
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
    color: color.primary,
    fontWeight: '500',
  },
  line: {height: 3, width: '100%'},
  desc: {
    fontSize: 15,
    color: color.primary,
    fontWeight: '500',
    lineHeight: 26.5,
    marginBottom: 32,
  },
  title: {fontSize: 30, color: color.primary, fontWeight: 'bold'},
  scroll: {paddingHorizontal: 32, backgroundColor: color.white},
  mb20: {marginBottom: 20},
});
