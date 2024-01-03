import React, {useEffect, useRef, useState} from 'react';
import {StyleSheet, Text} from 'react-native';
import {appSize} from '@abong.code/config/AppConstant';

const Countdown = ({
  visible,
  setVisible,
}: {
  visible: boolean;
  setVisible: Function;
}) => {
  let countdown = useRef({} as number);

  const [timeOtp, setTimeOtp] = useState(15);
  useEffect(() => {
    if (visible === true) {
      countdown.current = setInterval(() => {
        setTimeOtp(timeOtp - 1);
      }, 1000);
    }
    if (timeOtp === 0) {
      setVisible(false);
    }

    return () => clearInterval(countdown.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeOtp]);
  return <Text style={styles.text}> ({timeOtp}s)</Text>;
};
const styles = StyleSheet.create({
  text: {
    fontSize: appSize(12),
    fontWeight: '400',
    color: '#9e9e9e',
  },
});

export default Countdown;
