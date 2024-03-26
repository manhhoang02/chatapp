import {appSize} from '@abong.code/config/AppConstant';
import color from '@abong.code/theme/color';
import {useRegister} from 'app/api/auth';
import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import AppProcessingButton from '@abong.code/elements/AppProcessingButton';
import {useNavigation} from '@react-navigation/native';
import {ParamsAuth} from 'app/navigation/params';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {
  showToastMessageError,
  showToastMessageSuccess,
} from '@abong.code/helpers/messageHelper';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import AppContainer from 'app/components/Global/AppContainer';
import AppStyles from 'elements/AppStyles';
import IconEye from 'assets/icons/IconEye';
import moment from 'moment';
import IconCheckBox from 'assets/icons/IconCheckBox';

export default function () {
  const insets = useSafeAreaInsets();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState('Male');

  const [agreed, setAgreed] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(true);
  const [showConfirmPW, setShowConfirmPW] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  const {mutate} = useRegister();

  const navigation = useNavigation<NativeStackNavigationProp<ParamsAuth>>();

  const handleChangeDateOfBirth = (inputText: string) => {
    setDateOfBirth(inputText);

    const isValid = moment(inputText, 'DD/MM/YYYY', true).isValid();
    setError(isValid ? '' : 'Ngày tháng năm không hợp lệ');
  };

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
    <AppContainer>
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        style={[AppStyles.grow, {paddingTop: 21 + insets.top}, styles.scroll]}>
        <Text style={styles.signUpText}>Sign in</Text>

        <View style={[AppStyles.fill, {marginBottom: 105 + insets.bottom}]}>
          <View style={[AppStyles.row, styles.mb20]}>
            <TextInput
              placeholder="First name"
              placeholderTextColor="#FFFFFF80"
              style={[styles.textInput, {marginRight: appSize(19)}]}
              value={firstName}
              onChangeText={setFirstName}
            />
            <TextInput
              placeholder="Last name"
              placeholderTextColor="#FFFFFF80"
              style={styles.textInput}
              value={lastName}
              onChangeText={setLastName}
            />
          </View>

          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="Email address"
            placeholderTextColor="#FFFFFF80"
            style={[styles.textInput, styles.mb20]}
            inputMode="email"
            keyboardType="email-address"
          />

          <View style={styles.mb20}>
            <TextInput
              placeholder="Password"
              placeholderTextColor="#FFFFFF80"
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

          <View style={styles.mb20}>
            <TextInput
              placeholder="Confirm Password"
              placeholderTextColor="#FFFFFF80"
              style={styles.textInput}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={showConfirmPW}
            />
            <TouchableOpacity
              onPress={() => setShowConfirmPW(!showConfirmPW)}
              style={styles.iconEyeBtn}>
              <IconEye hide={showConfirmPW} />
            </TouchableOpacity>
          </View>

          <View style={styles.mb20}>
            <Text style={[styles.text, styles.mb7]}>Date of birth</Text>
            {error && (
              <Text style={[styles.text, {color: color.danger}, styles.mb7]}>
                {error}
              </Text>
            )}
            <TextInput
              placeholder="DD/MM/YYYY"
              placeholderTextColor="#FFFFFF80"
              style={styles.textInput}
              value={dateOfBirth}
              onChangeText={handleChangeDateOfBirth}
              maxLength={10}
            />
          </View>

          <View style={styles.mb20}>
            <Text style={[styles.text, styles.mb7]}>Gender</Text>

            <View style={AppStyles.row}>
              {genders.map(g => {
                const isSelected = g === gender;
                return (
                  <TouchableOpacity
                    key={g}
                    onPress={() => setGender(g)}
                    style={[styles.genderBtn, !isSelected && styles.disabled]}>
                    <Text style={styles.text}>{g}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <View style={[AppStyles.row, styles.mb20]}>
            <TouchableOpacity onPress={() => setAgreed(!agreed)}>
              <IconCheckBox isChecked={agreed} color={'#F9F9F9'} />
            </TouchableOpacity>

            <Text style={[styles.text, {marginLeft: appSize(11)}]}>
              I Agree with <Text style={styles.spanText}>privacy</Text> and{' '}
              <Text style={styles.spanText}>policy</Text>
            </Text>
          </View>

          <AppProcessingButton
            disabled={
              !email ||
              !password ||
              !confirmPassword ||
              !firstName ||
              !lastName ||
              !agreed
              // ||
              // !dateOfBirth ||
              // !gender
            }
            processing={processing}
            height={51}
            width={326}
            text="Sign in"
            onPress={handleRegister}
            style={styles.mb20}
            backgroundColor="#635A8F"
          />

          <View style={AppStyles.rowCenterBetween}>
            <Text style={styles.text}>Already have an account ?</Text>
            <TouchableOpacity
              onPress={() => {
                navigation.goBack();
              }}>
              <Text style={styles.signInText}>Sign in</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </AppContainer>
  );
}

const genders = ['Male', 'Female'];

const styles = StyleSheet.create({
  signInText: {
    color: '#3B21B2',
    fontSize: 17,
    fontWeight: '500',
  },
  spanText: {color: '#3B21B2'},
  disabled: {opacity: 0.4},
  genderBtn: {
    height: 53,
    width: 87,
    borderWidth: 3,
    borderColor: 'white',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 31,
  },
  mb7: {marginBottom: appSize(7)},
  text: {fontSize: 17, color: 'white', fontWeight: '500'},
  iconEyeBtn: {position: 'absolute', right: 20, top: 14.5, bottom: 14.5},
  mb20: {marginBottom: 20},
  textInput: {
    height: 53,
    flex: 1,
    borderWidth: 3,
    borderColor: 'white',
    borderRadius: 25,
    paddingLeft: 20,
    fontSize: 17,
    fontWeight: '500',
    color: 'white',
    justifyContent: 'center',
  },
  signUpText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 36,
  },
  scroll: {paddingHorizontal: 32},
});
