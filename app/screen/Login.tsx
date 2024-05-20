import color from '@abong.code/theme/color';
import {getUserById, useLoginSocial} from 'app/api/auth';
import React, {useEffect, useState} from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppProcessingButton from '@abong.code/elements/AppProcessingButton';
import {useNavigation} from '@react-navigation/native';
import {ParamsAuth} from 'app/navigation/params';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {showToastMessageError} from '@abong.code/helpers/messageHelper';
import auth from '@react-native-firebase/auth';
import {LoginManager, AccessToken} from 'react-native-fbsdk-next';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {consoleLog, consolelog} from '@abong.code/helpers/logHelper';
import AppContainer from 'app/components/Global/AppContainer';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import AppStyles from 'elements/AppStyles';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import AppConstant, {appSize} from '@abong.code/config/AppConstant';
import IconEye from 'assets/icons/IconEye';
import IconCheckBox from 'assets/icons/IconCheckBox';
import IconGoogle from 'assets/icons/IconGoogle';
import light from 'starling/theme/color/light';
import useAuthStore from 'app/store/authStore';
import {shallow} from 'zustand/shallow';

export default function () {
  const insets = useSafeAreaInsets();
  const [user, dispatchUser] = useAuthStore(
    s => [s.user, s.dispatchUser],
    shallow,
  );

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const navigation = useNavigation<NativeStackNavigationProp<ParamsAuth>>();
  const {mutate: loginSocial} = useLoginSocial();

  const handleLoginFacebook = async () => {
    // Attempt login with permissions
    const result = await LoginManager.logInWithPermissions([
      'public_profile',
      'email',
    ]);

    if (result.isCancelled) {
      throw 'User cancelled the login process';
    }

    // Once signed in, get the users AccesToken
    const data = await AccessToken.getCurrentAccessToken();

    if (!data) {
      throw 'Something went wrong obtaining access token';
    }

    // Create a Firebase credential with the AccessToken
    const facebookCredential = auth.FacebookAuthProvider.credential(
      data.accessToken,
    );

    // Sign-in the user with the credential
    const res = await auth().signInWithCredential(facebookCredential);
    consoleLog(res);
    if (res) {
      loginSocial(
        {
          email: res.additionalUserInfo?.profile!.email,
          first_name: res.additionalUserInfo?.profile!.first_name,
          last_name: res.additionalUserInfo?.profile!.last_name,
          avatar: res.additionalUserInfo?.profile!.picture.data.url,
          role: res.additionalUserInfo!.providerId,
        },
        {
          onSuccess: resLogin => {
            getUserById(user.id).then(resUser => {
              dispatchUser({...user, ...resUser});
            });
            AsyncStorage.setItem(AppConstant.SESSION.TOKEN, resLogin.token);
          },
        },
      );
    } else {
      showToastMessageError('Thất bại!', 'Hãy kiểm tra lại kết nối!');
    }
  };

  const handleLoginGoogle = async () => {
    await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});
    // Get the users ID token
    const {idToken} = await GoogleSignin.signIn();

    // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);

    // Sign-in the user with the credential
    const res = await auth().signInWithCredential(googleCredential);
    // consoleLog(res);
    if (res) {
      loginSocial(
        {
          email: res.additionalUserInfo?.profile!.email,
          first_name: res.additionalUserInfo?.profile!.family_name,
          last_name: res.additionalUserInfo?.profile!.given_name,
          avatar: res.additionalUserInfo?.profile!.picture,
          role: res.additionalUserInfo!.providerId,
        },
        {
          onSuccess: resLogin => {
            getUserById(user.id).then(resUser => {
              dispatchUser({...user, ...resUser});
            });
            AsyncStorage.setItem(AppConstant.SESSION.TOKEN, resLogin.token);
          },
        },
      );
    } else {
      showToastMessageError('Thất bại!', 'Hãy kiểm tra lại kết nối!');
    }
  };

  const handleLogin = () => {
    setProcessing(true);
    auth()
      .signInWithEmailAndPassword(email, password)
      .then(async res => {
        const uid = res.user.uid;
        if (uid) {
          const resUser = await getUserById(uid);
          if (resUser) {
            dispatchUser({
              ...resUser,
            });
            AsyncStorage.setItem('id', resUser.id);
          }
        }
        consolelog(res);
        setProcessing(false);
      })
      .catch(err => {
        setProcessing(false);

        if (err.code === 'auth/invalid-email') {
          showToastMessageError('Địa chỉ email không hợp lệ!');
        }
        if (err.code === 'auth/wrong-password') {
          showToastMessageError('Sai mật khẩu!');
        }
        if (err.code === 'auth/user-not-found') {
          showToastMessageError('Không tìm thấy người dùng!');
        }

        showToastMessageError('Thất bại', 'Sai tài khoản hoặc mật khẩu');
        console.error(err);
      });
  };

  const handleRememberMe = async () => {
    setRememberMe(!rememberMe);
    if (!rememberMe) {
      await AsyncStorage.setItem('email', email);
      await AsyncStorage.setItem('password', password);
    } else {
      await AsyncStorage.removeItem('email');
      await AsyncStorage.removeItem('password');
    }
  };

  useEffect(() => {
    const getInfo = async () => {
      const reEmail = await AsyncStorage.getItem('email');
      const rePassword = await AsyncStorage.getItem('password');
      if (reEmail !== null && rePassword !== null) {
        setEmail(reEmail);
        setPassword(rePassword);
        setRememberMe(true);
      }
    };
    getInfo();
  }, []);

  const handleClickForgotPassword = () => {
    navigation.navigate('ConfirmEmail');
  };

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        '967140539717-7q3b9isgbbmkbt3af9970tm4s7srtomk.apps.googleusercontent.com',
    });
  }, []);
  return (
    <AppContainer>
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        style={[AppStyles.grow, {paddingTop: 30 + insets.top}, styles.scroll]}>
        <Image
          source={require('assets/funchat.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.signInText}>Đăng nhập</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="Địa chỉ email"
          placeholderTextColor={color.primary}
          style={[styles.textInput, styles.mb19]}
          inputMode="email"
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <View style={styles.mb19}>
          <TextInput
            autoCapitalize="none"
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
            <IconEye hide={showPassword} color={color.primary} />
          </TouchableOpacity>
        </View>

        <View style={[styles.actionsField, styles.mb19]}>
          <View style={AppStyles.row}>
            <TouchableOpacity onPress={handleRememberMe}>
              <IconCheckBox color={color.primary} isChecked={rememberMe} />
            </TouchableOpacity>
            <Text style={styles.rememberMeText}>Ghi nhớ</Text>
          </View>
          <TouchableOpacity onPress={handleClickForgotPassword}>
            <Text style={styles.textForgot}>Bạn quên mật khẩu?</Text>
          </TouchableOpacity>
        </View>

        <AppProcessingButton
          disabled={!email || !password}
          processing={processing}
          height={51}
          width={326}
          text="Đăng nhập"
          onPress={handleLogin}
          style={styles.mb19}
          backgroundColor="#635A8F"
        />
        <Text style={[styles.signInWith, styles.mb19]}>Hoặc đăng nhập với</Text>

        <View style={[styles.socialField, styles.mb19]}>
          <TouchableOpacity
            onPress={handleLoginFacebook}
            style={[styles.socialBtn, {backgroundColor: color.btnFacebook}]}>
            <MaterialCommunityIcons
              name="facebook"
              size={20}
              color={color.white}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.socialBtn, {backgroundColor: color.btnTwitter}]}>
            <MaterialCommunityIcons
              name="twitter"
              size={20}
              color={color.white}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleLoginGoogle}
            style={styles.socialBtn}>
            <IconGoogle width={32} />
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Bạn chưa có tài khoản?</Text>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('Register');
            }}>
            <Text style={styles.signUpText}>Đăng ký</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
    </AppContainer>
  );
}
const styles = StyleSheet.create({
  signUpText: {
    color: '#3B21B2',
    fontSize: 17,
    fontWeight: '500',
  },
  footerText: {color: light.black, fontSize: 17, fontWeight: '500'},
  signInWith: {
    fontSize: 17,
    color: light.black,
    textAlign: 'center',
    fontWeight: '500',
  },
  rememberMeText: {
    fontSize: 17,
    color: light.black,
    marginLeft: 8,
    fontWeight: '500',
  },
  iconEyeBtn: {position: 'absolute', right: 20, top: 14.5, bottom: 14.5},
  scroll: {paddingHorizontal: 32, backgroundColor: 'white'},
  signInText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: color.primary,
    marginVertical: 36,
  },
  socialField: {flexDirection: 'row', justifyContent: 'center'},
  socialBtn: {
    width: 32,
    height: 32,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: color.primary,
    overflow: 'hidden',
  },
  mb19: {marginBottom: 19},
  logo: {
    height: appSize(120),
    width: appSize(250),
    alignSelf: 'center',
    tintColor: color.primary,
  },
  textInput: {
    height: 53,
    borderWidth: 3,
    borderColor: color.primary,
    borderRadius: 25,
    paddingLeft: 20,
    fontSize: 17,
    fontWeight: '500',
    color: color.primary,
    justifyContent: 'center',
  },
  actionsField: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  textForgot: {
    color: color.primary,
    fontSize: 17,
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
