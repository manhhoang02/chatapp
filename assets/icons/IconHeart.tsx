import color from '@abong.code/theme/color';
import * as React from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import Svg, {Path, SvgProps} from 'react-native-svg';

interface Props extends SvgProps {
  isLiked: boolean;
}

const AnimatedSvg = Animated.createAnimatedComponent(Svg);

function IconHeart(props: Props) {
  const scale = useSharedValue(1);

  React.useEffect(() => {
    scale.value = withTiming(1.2, {duration: 300});
    setTimeout(() => {
      scale.value = withTiming(1, {duration: 300});
    }, 200);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.isLiked]);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{scale: scale.value}],
    };
  });
  return (
    <AnimatedSvg
      style={animatedStyles}
      width={props.width || 24}
      height={props.width || 24}
      viewBox="0 0 24 24"
      fill="none"
      {...props}>
      {props.isLiked ? (
        <Path
          fill={'#FF204E'}
          d="M17.5,1.917a6.4,6.4,0,0,0-5.5,3.3,6.4,6.4,0,0,0-5.5-3.3A6.8,6.8,0,0,0,0,8.967c0,4.547,4.786,9.513,8.8,12.88a4.974,4.974,0,0,0,6.4,0C19.214,18.48,24,13.514,24,8.967A6.8,6.8,0,0,0,17.5,1.917Z"
        />
      ) : (
        <Path
          fill={color.primary}
          d="M17.25,1.851A6.568,6.568,0,0,0,12,4.558,6.568,6.568,0,0,0,6.75,1.851,7.035,7.035,0,0,0,0,9.126c0,4.552,4.674,9.425,8.6,12.712a5.29,5.29,0,0,0,6.809,0c3.922-3.287,8.6-8.16,8.6-12.712A7.035,7.035,0,0,0,17.25,1.851ZM13.477,19.539a2.294,2.294,0,0,1-2.955,0C5.742,15.531,3,11.736,3,9.126A4.043,4.043,0,0,1,6.75,4.851,4.043,4.043,0,0,1,10.5,9.126a1.5,1.5,0,0,0,3,0,4.043,4.043,0,0,1,3.75-4.275A4.043,4.043,0,0,1,21,9.126C21,11.736,18.258,15.531,13.477,19.539Z"
        />
      )}
    </AnimatedSvg>
  );
}

export default IconHeart;
