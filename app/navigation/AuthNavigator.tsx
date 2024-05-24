import {createNativeStackNavigator} from '@react-navigation/native-stack';
import ConfirmEmail from 'app/screen/ForgotPassword/ConfirmEmail';
import Login from 'app/screen/Login';
import Register from 'app/screen/Register';
import React from 'react';
import {ParamsAuth} from './params';

export default function () {
  const {Navigator, Screen} = createNativeStackNavigator<ParamsAuth>();
  return (
    <Navigator initialRouteName="Login" screenOptions={{headerShown: false}}>
      <Screen name="Login" component={Login} />
      <Screen name="ConfirmEmail" component={ConfirmEmail} />
      <Screen name="Register" component={Register} />
    </Navigator>
  );
}
