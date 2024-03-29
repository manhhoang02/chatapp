import {useEffect, useState} from 'react';
import {Keyboard, Platform} from 'react-native';

const isIos = Platform.OS === 'ios';

export const useKeyboard = () => {
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const showSubscription = Keyboard.addListener(
      isIos ? 'keyboardWillShow' : 'keyboardDidShow',
      () => {
        setKeyboardVisible(true);
      },
    );
    const hideSubscription = Keyboard.addListener(
      isIos ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
      },
    );

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  return {keyboardVisible};
};
