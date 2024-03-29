import * as React from 'react';
import Svg, {Path, SvgProps} from 'react-native-svg';

function IconAdd(props: SvgProps) {
  return (
    <Svg
      width={props.width || 18}
      height={props.width || 18}
      viewBox="0 0 18 18"
      fill="none"
      {...props}>
      <Path
        d="M8.646.758a8.37 8.37 0 108.37 8.371A8.387 8.387 0 008.647.76zm3.22 9.015H9.29v2.576a.644.644 0 01-1.288 0V9.773H5.427a.644.644 0 010-1.288h2.575V5.91a.644.644 0 111.288 0v2.575h2.576a.644.644 0 010 1.288z"
        fill={props.color || '#5435C7'}
      />
    </Svg>
  );
}

export default IconAdd;
