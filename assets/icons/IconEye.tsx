import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';

interface Props extends SvgProps {
  hide?: boolean;
}
const IconEye = (props: Props) => (
  <Svg
    width={props.width || 24}
    height={props.width || 24}
    viewBox="0 0 24 24"
    fill="none"
    {...props}>
    {!props.hide ? (
      <>
        <Path
          d="M14.53 9.47L9.47004 14.53C8.82004 13.88 8.42004 12.99 8.42004 12C8.42004 10.02 10.02 8.42 12 8.42C12.99 8.42 13.88 8.82 14.53 9.47Z"
          stroke="#F6ECF1"
          strokeOpacity={0.7}
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M17.82 5.77C16.07 4.45 14.07 3.73 12 3.73C8.46997 3.73 5.17997 5.81 2.88997 9.41C1.98997 10.82 1.98997 13.19 2.88997 14.6C3.67997 15.84 4.59997 16.91 5.59997 17.77"
          stroke="#F6ECF1"
          strokeOpacity={0.7}
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M8.42004 19.53C9.56004 20.01 10.77 20.27 12 20.27C15.53 20.27 18.82 18.19 21.11 14.59C22.01 13.18 22.01 10.81 21.11 9.39999C20.78 8.87999 20.42 8.38999 20.05 7.92999"
          stroke="#F6ECF1"
          strokeOpacity={0.7}
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M15.5099 12.7C15.2499 14.11 14.0999 15.26 12.6899 15.52"
          stroke="#F6ECF1"
          strokeOpacity={0.7}
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </>
    ) : (
      <>
        <Path
          d="M14.53 9.97L9.47004 15.03C8.82004 14.38 8.42004 13.49 8.42004 12.5C8.42004 10.52 10.02 8.92 12 8.92C12.99 8.92 13.88 9.32 14.53 9.97Z"
          stroke="#F6ECF1"
          strokeOpacity={0.7}
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M17.82 6.27C16.07 4.95 14.07 4.23 12 4.23C8.46997 4.23 5.17997 6.31 2.88997 9.91C1.98997 11.32 1.98997 13.69 2.88997 15.1C3.67997 16.34 4.59997 17.41 5.59997 18.27"
          stroke="#F6ECF1"
          strokeOpacity={0.7}
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M8.42004 20.03C9.56004 20.51 10.77 20.77 12 20.77C15.53 20.77 18.82 18.69 21.11 15.09C22.01 13.68 22.01 11.31 21.11 9.89999C20.78 9.37999 20.42 8.88999 20.05 8.42999"
          stroke="#F6ECF1"
          strokeOpacity={0.7}
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M15.5099 13.2C15.2499 14.61 14.0999 15.76 12.6899 16.02"
          stroke="#F6ECF1"
          strokeOpacity={0.7}
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M9.47 15.03L2 22.5"
          stroke="#F6ECF1"
          strokeOpacity={0.7}
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M22 2.5L14.53 9.97"
          stroke="#F6ECF1"
          strokeOpacity={0.7}
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </>
    )}
  </Svg>
);
export default IconEye;
