import {StyleProp, View, ViewProps, ViewStyle} from 'react-native';
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import AppStyles from 'elements/AppStyles';

interface Props extends ViewProps {
  containerStyle?: StyleProp<ViewStyle>;
}

export default function AppContainer(props: Props) {
  return (
    <LinearGradient
      colors={['#3B21B7', '#8B64DA', '#D195EE', '#CECBD3']}
      locations={[0.02, 0.2, 0.4, 1]}
      style={[AppStyles.fill, props.containerStyle]}>
      <View {...props} style={AppStyles.fill}>
        {props.children}
      </View>
    </LinearGradient>
  );
}
