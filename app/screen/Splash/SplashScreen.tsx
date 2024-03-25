import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import AppConstant, {appSize} from '@abong.code/config/AppConstant';
import {BlurView} from '@react-native-community/blur';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {ParamsAuth, ParamsSplash} from 'app/navigation/params';
import {CompositeScreenProps} from '@react-navigation/native';

type CombinedProps = CompositeScreenProps<
  NativeStackScreenProps<ParamsAuth>,
  NativeStackScreenProps<ParamsSplash, 'SplashScreen'>
>;

export default function SplashScreen({navigation}: CombinedProps) {
  const onPress = () => {
    navigation.navigate('Login');
    AsyncStorage.setItem('hasFirst', '1');
  };
  return (
    <ImageBackground
      source={require('assets/image/splash.png')}
      style={styles.container}
      resizeMode="cover">
      <View style={styles.welcomeField}>
        <Text style={styles.welcomeText}>Welcome !</Text>
        <Text style={styles.title}>
          Experience a wonderful{'\n'}moment with{' '}
          <Text style={styles.logoText}>Funchat</Text>
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
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
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
  title: {fontSize: appSize(20), color: 'white', lineHeight: 33},
  welcomeText: {fontSize: appSize(36), color: 'white'},
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
