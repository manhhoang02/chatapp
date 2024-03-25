import AppConstant, {appSize} from '@abong.code/config/AppConstant';
import {useAppContext} from '@abong.code/context/AppProvider';
import color from '@abong.code/theme/color';
import {getProfileMe, useLogin, useLoginSocial} from 'app/api/auth';
import React, {useEffect, useState} from 'react';
import {
  Image,
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {TextInput} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppProcessingButton from '@abong.code/elements/AppProcessingButton';
import {initApiHeader} from '@abong.code/api/AppNetworking';
import {useNavigation} from '@react-navigation/native';
import {ParamsAuth} from 'app/navigation/params';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {showToastMessageError} from '@abong.code/helpers/messageHelper';
import auth from '@react-native-firebase/auth';
import {LoginManager, AccessToken} from 'react-native-fbsdk-next';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {consoleLog} from '@abong.code/helpers/logHelper';

export default function () {
  const {setUser} = useAppContext();
  const [email, setEmail] = useState('manhkuma@gmail.com');
  const [password, setPassword] = useState('123456');
  const [showPassword, setShowPassword] = useState(true);
  const [processing, setProcessing] = useState(false);
  const navigation = useNavigation<NativeStackNavigationProp<ParamsAuth>>();
  const {mutate} = useLogin();
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
            initApiHeader(resLogin.token);
            getProfileMe().then(dataUser => {
              setUser({...dataUser, token: resLogin.token});
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
            initApiHeader(resLogin.token);
            getProfileMe().then(dataUser => {
              setUser({...dataUser, token: resLogin.token});
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
    if (email && password) {
      setProcessing(true);
      mutate(
        {email, password},
        {
          onSuccess: res => {
            initApiHeader(res.token);
            getProfileMe().then(data => {
              setUser({...data, token: res.token});
            });
            AsyncStorage.setItem(AppConstant.SESSION.TOKEN, res.token);
          },
          onError: () => {
            showToastMessageError('Thất bại', 'Sai tài khoản hoặc mật khẩu');
          },
          onSettled: () => {
            setTimeout(() => {
              setProcessing(false);
            }, 1500);
          },
        },
      );
    }
  };
  const handleClickForgotPassword = () => {
    navigation.navigate('ConfirmEmail');
  };

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        '328214108378-d28hjog5jn8dats7t0djagcnmjbr7ioh.apps.googleusercontent.com',
    });
  }, []);
  return (
    <Pressable style={styles.container} onPress={() => Keyboard.dismiss()}>
      <View style={styles.boxForm}>
        <Image
          source={require('assets/image/logo_app.png')}
          style={styles.logo}
          resizeMode="stretch"
        />
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
        <View style={styles.btnForgot}>
          <TouchableOpacity onPress={handleClickForgotPassword}>
            <Text style={styles.textForgot}>Quên mật khẩu?</Text>
          </TouchableOpacity>
        </View>

        <AppProcessingButton
          disabled={!email || !password}
          processing={processing}
          height={appSize(45)}
          width={appSize(200)}
          text="Đăng nhập"
          onPress={handleLogin}
        />
        <View style={styles.lineOr}>
          <View style={styles.line} />
          <Text style={{marginHorizontal: appSize(10), color: color.black}}>
            Hoặc
          </Text>
          <View style={styles.line} />
        </View>

        <TouchableOpacity style={styles.btn} onPress={handleLoginFacebook}>
          <MaterialCommunityIcons
            name="facebook"
            size={appSize(24)}
            color={color.btnFacebook}
          />
          <Text style={{marginLeft: appSize(8), color: color.black}}>
            Đăng nhập bằng Facebook
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn} onPress={handleLoginGoogle}>
          <Image
            source={require('assets/image/logo_google.png')}
            style={{width: appSize(22), height: appSize(22)}}
          />
          <Text style={{marginLeft: appSize(8), color: color.black}}>
            Đăng nhập bằng Google
          </Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={{color: color.black}}>Bạn chưa có tài khoản?</Text>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('Register');
            }}>
            <Text
              style={{
                color: color.primary,
                marginLeft: appSize(5),
              }}>
              Đăng ký
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Pressable>
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
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '85%',
    alignSelf: 'center',
    paddingVertical: appSize(10),
    borderRadius: appSize(5),
    shadowColor: color.primary,
    shadowOffset: {
      width: 0,
      height: 1.5,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    backgroundColor: color.white,
    marginBottom: appSize(15),
  },
  line: {
    backgroundColor: color.black,
    height: appSize(0.4),
    flex: 1,
  },
  lineOr: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: appSize(20),
  },
});
