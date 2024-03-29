import * as React from 'react';
import Svg, {
  Circle,
  Defs,
  LinearGradient,
  Stop,
  SvgProps,
} from 'react-native-svg';

function IconGreenDot(props: SvgProps) {
  return (
    <Svg
      width={props.width || 12}
      height={props.width || 12}
      viewBox="0 0 12 12"
      fill="none"
      {...props}>
      <Circle
        cx={6.042}
        cy={5.887}
        r={4.676}
        fill="#26A842"
        stroke="url(#prefix__paint0_linear_22_1479)"
        strokeWidth={1.169}
      />
      <Defs>
        <LinearGradient
          id="prefix__paint0_linear_22_1479"
          x1={3.12}
          y1={9.393}
          x2={31.758}
          y2={-12.816}
          gradientUnits="userSpaceOnUse">
          <Stop offset={0.049} stopColor="#D1D1D1" />
          <Stop offset={0.31} stopColor="#8862D9" />
        </LinearGradient>
      </Defs>
    </Svg>
  );
}

export default IconGreenDot;
