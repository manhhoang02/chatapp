import {appSize} from '@abong.code/config/AppConstant';
import AppProcessingButton from '@abong.code/elements/AppProcessingButton';
import {
  showToastMessageError,
  showToastMessageSuccess,
} from '@abong.code/helpers/messageHelper';
import color from '@abong.code/theme/color';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import AppContainer from 'app/components/Global/AppContainer';
import {ParamsAuth} from 'app/navigation/params';
import {COLLECTION} from 'app/store/globalStore';
import IconCheckBox from 'assets/icons/IconCheckBox';
import IconEye from 'assets/icons/IconEye';
import AppStyles from 'elements/AppStyles';
import moment from 'moment';
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
import light from 'starling/theme/color/light';
import messaging from '@react-native-firebase/messaging';

export default function () {
  const insets = useSafeAreaInsets();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState('male');

  const [agreed, setAgreed] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(true);
  const [showConfirmPW, setShowConfirmPW] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  const navigation = useNavigation<NativeStackNavigationProp<ParamsAuth>>();

  const handleChangeDateOfBirth = (inputText: string) => {
    setDateOfBirth(inputText);

    const isValid = moment(inputText, 'DD/MM/YYYY', true).isValid();
    setError(isValid ? '' : 'Ngày tháng năm không hợp lệ');
  };

  const handleRegister = () => {
    setProcessing(true);

    auth()
      .createUserWithEmailAndPassword(email, password)
      .then(res => {
        setProcessing(false);

        const uid = res.user.uid;
        // const avt = `https://getstream.io/random_png/?id=${uid}&name=${firstName}+${lastName}`;
        const avt =
          gender === 'male'
            ? 'https://avatar.iran.liara.run/public/boy'
            : 'https://avatar.iran.liara.run/public/girl';
        firestore()
          .collection(COLLECTION.USERS)
          .doc(uid)
          .set({
            id: uid,
            firstName,
            lastName,
            email,
            password: hashPassword(password),
            dateOfBirth,
            gender,
            createdAt: new Date(),
            updatedAt: new Date(),
            avatar: avt,
            background: '',
            friends: [],
            sent_friend_requests: [],
            friend_requests: [],
          })
          .then(() => {
            showToastMessageSuccess('Đăng ký thành công');

            navigation.navigate('Login');

            messaging()
              .subscribeToTopic(uid)
              .then(() => console.log('Subscribed to topic: ' + uid));
          });
      })
      .catch(err => {
        setProcessing(false);
        if (err.code === 'auth/email-already-in-use') {
          showToastMessageError('Địa chỉ email đã được sử dụng!');
        }

        if (err.code === 'auth/invalid-email') {
          showToastMessageError('Địa chỉ email không hợp lệ!');
        }

        showToastMessageError(err);
      });
  };

  return (
    <AppContainer>
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        style={[AppStyles.grow, {paddingTop: 21 + insets.top}, styles.scroll]}>
        <Text style={styles.signUpText}>Đăng ký</Text>

        <View style={[AppStyles.fill, {marginBottom: 105 + insets.bottom}]}>
          <View style={[AppStyles.row, styles.mb20]}>
            <TextInput
              placeholder="Họ"
              placeholderTextColor={color.primary}
              style={[styles.textInput, {marginRight: appSize(19)}]}
              value={firstName}
              onChangeText={setFirstName}
            />
            <TextInput
              placeholder="Tên"
              placeholderTextColor={color.primary}
              style={styles.textInput}
              value={lastName}
              onChangeText={setLastName}
            />
          </View>

          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="Địa chỉ email"
            placeholderTextColor={color.primary}
            style={[styles.textInput, styles.mb20]}
            inputMode="email"
            keyboardType="email-address"
          />

          <View style={styles.mb20}>
            <TextInput
              placeholder="Mật khẩu"
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

          <View style={styles.mb20}>
            <TextInput
              placeholder="Nhập lại mật khẩu"
              placeholderTextColor={color.primary}
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
            <Text style={[styles.text, styles.mb7]}>Ngày sinh</Text>
            {error && (
              <Text style={[styles.text, {color: color.danger}, styles.mb7]}>
                {error}
              </Text>
            )}
            <TextInput
              placeholder="DD/MM/YYYY"
              placeholderTextColor={color.primary}
              style={styles.textInput}
              value={dateOfBirth}
              onChangeText={handleChangeDateOfBirth}
              maxLength={10}
            />
          </View>

          <View style={styles.mb20}>
            <Text style={[styles.text, styles.mb7]}>Giới tính</Text>

            <View style={AppStyles.row}>
              {genders.map(g => {
                const isSelected = g.value === gender;
                return (
                  <TouchableOpacity
                    key={g.value}
                    onPress={() => setGender(g.value)}
                    style={[styles.genderBtn, !isSelected && styles.disabled]}>
                    <Text style={styles.text}>{g.label}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <View style={[AppStyles.row, styles.mb20]}>
            <TouchableOpacity onPress={() => setAgreed(!agreed)}>
              <IconCheckBox isChecked={agreed} color={color.primary} />
            </TouchableOpacity>

            <Text style={[styles.text, {marginLeft: appSize(11)}]}>
              Tôi đồng ý với <Text style={styles.spanText}>chính sách</Text> and{' '}
              <Text style={styles.spanText}>bảo mật</Text>
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
            text="Đăng ký"
            onPress={handleRegister}
            style={styles.mb20}
            backgroundColor="#635A8F"
          />

          <View style={AppStyles.rowCenterBetween}>
            <Text style={styles.text}>Bạn đã có tài khoản?</Text>
            <TouchableOpacity
              onPress={() => {
                navigation.goBack();
              }}>
              <Text style={styles.signInText}>Đăng nhập</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </AppContainer>
  );
}

function hashPassword(password: string) {
  let hashedPassword = '';
  for (let i = 0; i < password.length; i++) {
    const charCode = password.charCodeAt(i);
    hashedPassword += String.fromCharCode(charCode + 10);
  }
  return hashedPassword;
}

const genders = [
  {value: 'male', label: 'Nam'},
  {value: 'female', label: 'Nữ'},
];

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
    borderColor: color.primary,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 31,
  },
  mb7: {marginBottom: appSize(7)},
  text: {fontSize: 17, color: light.black, fontWeight: '500'},
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
  signUpText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: color.primary,
    marginBottom: 36,
  },
  scroll: {paddingHorizontal: 32, backgroundColor: color.white},
});
