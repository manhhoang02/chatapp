import React, {useEffect, useRef, useState} from 'react';
import {AppText} from '@starlingtech/element';

const Countdown = ({
  visible,
  setVisible,
}: {
  visible: boolean;
  setVisible: Function;
}) => {
  let countdown = useRef<any>();

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
  return (
    <AppText size={16} color="primary" ml={4}>
      ({timeOtp}s)
    </AppText>
  );
};

export default Countdown;
