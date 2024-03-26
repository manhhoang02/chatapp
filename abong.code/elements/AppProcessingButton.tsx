import {appSize} from '@abong.code/config/AppConstant';
import color from '@abong.code/theme/color';
import React, {useEffect, useState} from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  TextStyle,
  StyleProp,
  ViewStyle,
} from 'react-native';
import {ActivityIndicator} from 'react-native-paper';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';

type Props = {
  backgroundColor?: string;
  disabled?: boolean;
  width: number;
  height: number;
  text: string;
  textStyle?: TextStyle;
  style?: StyleProp<ViewStyle>;
  processing?: boolean;
  onPress: () => void;
};

export default function (props: Props) {
  const sharedValue = useSharedValue(props.width);
  const [isLoading, setIsLoading] = useState(false);

  const animBtn = useAnimatedStyle(() => {
    return {
      width: withTiming(sharedValue.value, {
        duration: 400,
      }),
      borderRadius: withTiming(sharedValue.value, {
        duration: 400,
      }),
    };
  });
  const onPress = () => {
    props.onPress();
  };
  useEffect(() => {
    if (props.processing) {
      sharedValue.value = props.height;
      setIsLoading(true);
    } else {
      sharedValue.value = props.width;
      setTimeout(() => {
        setIsLoading(false);
      }, 350);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.processing]);
  return (
    <TouchableOpacity
      disabled={props.disabled}
      onPress={onPress}
      style={[
        styles.containerBtn,
        props.style,
        props.disabled && styles.disabled,
      ]}>
      <Animated.View
        style={[
          styles.btnLogin,
          {
            height: props.height,
            backgroundColor: props.backgroundColor,
          },
          animBtn,
        ]}>
        {props.processing ? (
          <ActivityIndicator color={color.white} />
        ) : (
          !isLoading && (
            <Text
              style={[{color: color.white}, styles.textLogin, props.textStyle]}>
              {props.text}
            </Text>
          )
        )}
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  disabled: {opacity: 0.7},
  btnLogin: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: appSize(5),
    flex: 1,
  },
  containerBtn: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  textLogin: {
    fontSize: appSize(22),
    fontWeight: '700',
  },
});
