import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';
const IconSearch = (props: SvgProps) => (
  <Svg
    viewBox="0 0 24 24"
    width={props.width || 24}
    height={props.width || 24}
    {...props}>
    <Path
      fill={props.color}
      d="M23.707,22.293l-5.969-5.969a10.016,10.016,0,1,0-1.414,1.414l5.969,5.969a1,1,0,0,0,1.414-1.414ZM10,18a8,8,0,1,1,8-8A8.009,8.009,0,0,1,10,18Z"
    />
  </Svg>
);
export default IconSearch;
