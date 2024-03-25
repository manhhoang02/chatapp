import React from 'react';
import SplashScreen from 'app/screen/Splash/SplashScreen';
import {ParamsSplash} from '../params';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

const AuthStack = createNativeStackNavigator<ParamsSplash>();
export default function () {
  return (
    <AuthStack.Navigator>
      <AuthStack.Screen
        options={{headerShown: false}}
        name="SplashScreen"
        component={SplashScreen}
      />
    </AuthStack.Navigator>
  );
}
