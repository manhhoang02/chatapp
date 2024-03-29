import AppConstant, {appSize} from '@abong.code/config/AppConstant';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {BlurView} from '@react-native-community/blur';
import {useGlobalStore} from 'app/store/globalStore';
import React from 'react';
import {
  Image,
  ImageBackground,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function SplashScreen() {
  const dispatchIsFirstTime = useGlobalStore(s => s.dispatchIsFirstTime);
  const onPress = () => {
    dispatchIsFirstTime(false);
    AsyncStorage.setItem('isFirstTime', 'false');
  };
  return (
    <>
      <StatusBar barStyle={'light-content'} />
      <ImageBackground
        source={require('assets/image/splash.png')}
        style={styles.container}
        resizeMode="cover">
        <View style={styles.welcomeField}>
          <Text style={styles.welcomeText}>Chào mừng !</Text>
          <Text style={styles.title}>
            Trải nghiệm khoảnh khắc{'\n'}tuyệt vời với{' '}
            <Image
              source={require('assets/image/logo_text.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </Text>
          <BlurView
            blurType="light"
            blurAmount={21}
            overlayColor="transparent"
            style={styles.blurView}
          />
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.button}
            onPress={onPress}>
            <Text style={styles.buttonText}>Bắt đầu</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </>
  );
}

const styles = StyleSheet.create({
  logo: {width: 150, height: 40},
  buttonText: {fontSize: 22, fontWeight: 'bold', color: 'white'},
  button: {
    width: 317,
    borderRadius: 40,
    backgroundColor: '#635A8F',
    height: 51,
    alignItems: 'center',
    justifyContent: 'center',
  },
  blurView: {
    position: 'absolute',
    zIndex: -1,
    overflow: 'hidden',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  logoText: {fontSize: appSize(30), color: '#3B21B595'},
  title: {
    fontSize: appSize(20),
    fontWeight: '500',
    color: 'white',
  },
  welcomeText: {fontSize: appSize(36), color: 'white', fontWeight: '600'},
  welcomeField: {
    height: appSize(282),
    width: AppConstant.SCREEN_WIDTH,
    backgroundColor: '#CB98EB',
    opacity: 0.85,
    borderTopRightRadius: 40,
    borderTopLeftRadius: 40,
    justifyContent: 'space-evenly',
    paddingLeft: 50,
    overflow: 'hidden',
  },
  container: {
    width: AppConstant.SCREEN_WIDTH,
    height: AppConstant.SCREEN_HEIGHT,
    flex: 1,
    justifyContent: 'flex-end',
  },
});
