import AppConstant from '@abong.code/config/AppConstant';
import color from '@abong.code/theme/color';
import React, {useState} from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';
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
import AppContainer from 'app/components/Global/AppContainer';
import AppStyles from 'elements/AppStyles';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import light from 'vn.starlingTech/theme/color/light';
import {AppBlock, AppText, AppTouchableOpacity} from '@starlingtech/element';
import AppProcessingButton from '@abong.code/elements/AppProcessingButton';

export default function ({
  navigation,
  route,
}: NativeStackScreenProps<ParamsAuth, 'ConfirmOTP'>) {
  const insets = useSafeAreaInsets();

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
    <AppContainer>
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        style={[AppStyles.grow, {paddingTop: 20 + insets.top}, styles.scroll]}>
        <TouchableOpacity
          style={styles.mb20}
          onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back-outline" size={24} color={color.white} />
        </TouchableOpacity>

        <Text style={[styles.title, styles.mb20]}>Enter code</Text>

        <Text style={styles.desc}>
          Enter the 4-digit code we sent you at email{'\n'}
          {route.params.email}
        </Text>

        <OTPInputView
          style={styles.otpInputView}
          pinCount={6}
          code={otp}
          onCodeChanged={setOtp}
          autoFocusOnLoad
          codeInputFieldStyle={styles.codeInputFieldStyle}
          selectionColor="white"
        />

        <AppBlock mv={20} row alignItems="center">
          <AppText size={16} color="white" weight="500">
            You have not received the OTP code.
          </AppText>

          {visible ? (
            <CountDown visible={visible} setVisible={setVisible} />
          ) : (
            <AppTouchableOpacity ml={4} onPress={handleReSend}>
              <AppText size={16} color="primary" weight="500">
                Resend
              </AppText>
            </AppTouchableOpacity>
          )}
        </AppBlock>

        <AppProcessingButton
          disabled={!otp || otp.length < 6}
          processing={processing}
          height={51}
          text="NEXT"
          width={AppConstant.UI_WIDTH - 64}
          backgroundColor="#635A8F"
          onPress={handleConfirm}
        />
      </KeyboardAwareScrollView>
    </AppContainer>
  );
}

const styles = StyleSheet.create({
  otpInputView: {
    width: 282,
    height: 58,
    alignSelf: 'center',
  },
  codeInputFieldStyle: {
    width: 41,
    height: 58,
    borderWidth: 3,
    borderRadius: 10,
    color: light.white,
    borderColor: '#8E63D6',
    fontWeight: '500',
    fontSize: 21,
  },

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
