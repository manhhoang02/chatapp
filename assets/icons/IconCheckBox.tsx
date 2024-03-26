import * as React from 'react';
import Svg, {SvgProps, Path, Rect} from 'react-native-svg';
interface Props extends SvgProps {
  isChecked?: boolean;
}

const IconCheckBox = (props: Props) => (
  <Svg
    viewBox="0 0 512 512"
    width={props.width || 24}
    height={props.width || 24}
    {...props}>
    {props.isChecked ? (
      <>
        <Path
          fill="none"
          stroke={props.color || 'black'}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={32}
          d="M352 176L217.6 336 160 272"
        />
        <Rect
          x={64}
          y={64}
          width={384}
          height={384}
          rx={48}
          ry={48}
          fill="none"
          stroke={props.color || 'black'}
          strokeLinejoin="round"
          strokeWidth={32}
        />
      </>
    ) : (
      <Path
        d="M416 448H96a32.09 32.09 0 01-32-32V96a32.09 32.09 0 0132-32h320a32.09 32.09 0 0132 32v320a32.09 32.09 0 01-32 32z"
        fill="none"
        stroke={props.color || 'black'}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={32}
      />
    )}
  </Svg>
);
export default IconCheckBox;
