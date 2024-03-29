import React from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import Svg, {SvgProps} from 'react-native-svg';

interface Props extends SvgProps {
  isFocused?: boolean;
}

const AnimatedSvg = Animated.createAnimatedComponent(Svg);

export default function (props: Props) {
  const scale = useSharedValue(1);

  React.useEffect(() => {
    if (props.isFocused) {
      scale.value = withTiming(1.5, {duration: 400});
      setTimeout(() => {
        scale.value = withTiming(1, {duration: 400});
      }, 200);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.isFocused]);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{scale: scale.value}],
    };
  });
  return (
    <AnimatedSvg
      style={animatedStyles}
      viewBox="0 0 24 24"
      width={props.width || 24}
      height={props.width || 24}
      {...props}>
      {props.children}
    </AnimatedSvg>
  );
}
