import * as React from 'react';
import Svg, {Path, SvgProps} from 'react-native-svg';

function Icon2Users(props: SvgProps) {
  return (
    <Svg
      width={props.width || 14}
      height={props.width || 14}
      viewBox="0 0 14 14"
      fill="none"
      {...props}>
      <Path
        d="M5.343 6.34a1.061 1.061 0 00-.192 0 2.578 2.578 0 01-2.49-2.583c0-1.43 1.154-2.59 2.59-2.59a2.587 2.587 0 01.093 5.174zM9.572 2.333a2.04 2.04 0 012.042 2.042c0 1.103-.875 2-1.966 2.042a.658.658 0 00-.151 0M2.427 8.493c-1.412.945-1.412 2.485 0 3.425 1.604 1.073 4.235 1.073 5.839 0 1.412-.945 1.412-2.485 0-3.425-1.598-1.067-4.23-1.067-5.84 0zM10.698 11.667a2.82 2.82 0 001.144-.508c.91-.682.91-1.808 0-2.49a2.9 2.9 0 00-1.126-.502"
        stroke={props.color || '#E5D7F7'}
        strokeWidth={0.875}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default Icon2Users;
