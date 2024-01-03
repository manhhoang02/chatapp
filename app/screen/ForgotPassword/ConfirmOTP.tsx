import {appSize} from '@abong.code/config/AppConstant';
import color from '@abong.code/theme/color';
import React, {useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {ParamsAuth} from 'app/navigation/params';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CountDown from 'app/components/CountDown';
import {useSendOTP, useVerifyOTP} from 'app/api/auth';
import {
  showToastMessageError,
  showToastMessageSuccess,
} from '@abong.code/helpers/messageHelper';
import AppProcessingButton from '@abong.code/elements/AppProcessingButton';

export default function ({
  navigation,
  route,
}: NativeStackScreenProps<ParamsAuth, 'ConfirmOTP'>) {
  const {top} = useSafeAreaInsets();
  const [otp, setOtp] = useState('');
  const [visible, setVisible] = useState(false);
  const [processing, setProcessing] = useState(false);
  const {mutate} = useSendOTP();
  const {mutate: verifyOTP} = useVerifyOTP();
  const handleReSend = () => {
    setVisible(true);
    mutate(route?.params?.email, {
      onSuccess: () => {
        showToastMessageSuccess('Thành công!', 'Vui lòng kiểm tra email');
      },
      onError: () => {
        showToastMessageError('Thất bại', 'Gặp lỗi khi gửi email');
      },
    });
  };
  const handleConfirm = () => {
    setProcessing(true);
    verifyOTP(
      {
        email: route?.params?.email,
        otp,
      },
      {
        onSuccess: () => {
          showToastMessageSuccess(' Thành công', 'Thành công');
          navigation.navigate('ResetPassword', {email: route?.params?.email});
        },
        onError: () => {
          showToastMessageError('Thất bại!', 'Sai mã OTP');
        },
        onSettled: () => {
          setTimeout(() => {
            setProcessing(false);
          }, 1500);
        },
      },
    );
  };
  return (
    <View style={[styles.container, {paddingTop: top}]}>
      <View style={[styles.header, {marginTop: top}]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} />
        </TouchableOpacity>
      </View>
      <Text style={styles.title}>
        Chúng tôi đã gửi 1 mã OTP về email "{route?.params?.email}" của bạn.
      </Text>

      <OTPInputView
        style={{width: '80%', height: 150, alignSelf: 'center'}}
        pinCount={6}
        code={otp} //You can supply this prop or not. The component will be used as a controlled / uncontrolled component respectively.
        onCodeChanged={code => {
          setOtp(code);
        }}
        autoFocusOnLoad
        codeInputFieldStyle={styles.codeInputFieldStyle}
        codeInputHighlightStyle={styles.underlineStyleHighLighted}
        // onCodeFilled={code => {
        //   console.log(`Code is ${code}, you are good to go!`);
        // }}
      />
      <View style={styles.row}>
        <Text style={{fontSize: appSize(12)}}>Bạn chưa nhận được mã OTP. </Text>
        <TouchableOpacity disabled={visible} onPress={handleReSend}>
          <Text
            style={[
              styles.textReSend,
              {color: visible ? '#9e9e9e' : '#F77F00'},
            ]}>
            Gửi lại
          </Text>
        </TouchableOpacity>
        {visible && <CountDown visible={visible} setVisible={setVisible} />}
      </View>

      <AppProcessingButton
        disabled={otp.length < 6}
        processing={processing}
        height={appSize(40)}
        width={appSize(200)}
        text="Xác nhận OTP"
        textStyle={styles.textBtn}
        onPress={handleConfirm}
      />
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
    fontSize: appSize(13),
  },
  codeInputFieldStyle: {
    width: 30,
    height: 45,
    borderWidth: 0,
    borderBottomWidth: 1,
    color: 'black',
  },
  underlineStyleHighLighted: {
    borderColor: '#03DAC6',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: appSize(16),
  },
  textReSend: {
    fontSize: appSize(12),
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textBtn: {
    fontSize: appSize(15),
    color: color.white,
  },
});
