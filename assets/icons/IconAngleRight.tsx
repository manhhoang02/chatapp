import * as React from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import Svg, {SvgProps, Path} from 'react-native-svg';

const AnimatedSvg = Animated.createAnimatedComponent(Svg);

type Props = SvgProps & {
  show?: boolean;
};

const IconAngleRight = (props: Props) => {
  const rotate = useSharedValue(0);

  React.useEffect(() => {
    if (props.show) {
      rotate.value = withTiming(90, {duration: 300});
    } else {
      rotate.value = withTiming(0, {duration: 300});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.show]);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{rotate: `${rotate.value}deg`}],
    };
  });

  return (
    <AnimatedSvg
      style={animatedStyles}
      id="arrow-circle-down"
      viewBox="0 0 24 24"
      width={24}
      height={24}
      {...props}>
      <Path
        fill={props.color}
        d="M0,12A12,12,0,1,0,12,0,12.013,12.013,0,0,0,0,12Zm22,0A10,10,0,1,1,12,2,10.011,10.011,0,0,1,22,12Z"
      />
      <Path
        fill={props.color}
        d="M16,12a2.993,2.993,0,0,1-.752,1.987c-.291.327-.574.637-.777.84L11.647,17.7a1,1,0,1,1-1.426-1.4L13.05,13.42c.187-.188.441-.468.7-.759a1,1,0,0,0,0-1.323c-.258-.29-.512-.57-.693-.752L10.221,7.7a1,1,0,1,1,1.426-1.4l2.829,2.879c.2.2.48.507.769.833A2.99,2.99,0,0,1,16,12Z"
      />
    </AnimatedSvg>
  );
};
export default IconAngleRight;
