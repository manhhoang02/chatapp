import {appSize} from '@abong.code/config/AppConstant';
import color from '@abong.code/theme/color';
import React, {useEffect, useState} from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
  TextStyle,
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
    <View style={styles.containerBtn}>
      <Animated.View
        style={[
          styles.btnLogin,
          {
            height: props.height,
            backgroundColor: !props.disabled
              ? props.backgroundColor || color.primary
              : color.disabled,
          },
          animBtn,
        ]}>
        {props.processing ? (
          <ActivityIndicator color={color.white} />
        ) : (
          !isLoading && (
            <TouchableOpacity disabled={props.disabled} onPress={onPress}>
              <Text
                style={[
                  {color: color.white},
                  styles.textLogin,
                  props.textStyle,
                ]}>
                {props.text}
              </Text>
            </TouchableOpacity>
          )
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  btnLogin: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: appSize(5),
    marginTop: appSize(25),
  },
  containerBtn: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  textLogin: {
    fontSize: appSize(18),
    fontWeight: '600',
  },
});
