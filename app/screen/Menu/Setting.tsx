import React from 'react';
import {AppBlock, AppText} from '@starlingtech/element';
import {Switch} from 'react-native-paper';
import AppStyles from 'elements/AppStyles';
import useAuthStore from 'app/store/authStore';
import messaging from '@react-native-firebase/messaging';

export default function Setting() {
  const userId = useAuthStore(s => s.user.id);
  const [isSwitchOn, setIsSwitchOn] = React.useState(true);

  const onToggleSwitch = () => {
    setIsSwitchOn(!isSwitchOn);
    if (isSwitchOn) {
      messaging()
        .unsubscribeFromTopic(userId)
        .then(() => console.log('unsubscribed'));
    } else {
      messaging()
        .subscribeToTopic(userId)
        .then(() => console.log('subscribed'));
    }
  };
  return (
    <AppBlock flex background="white">
      <AppBlock style={AppStyles.rowCenterBetween} padding={[12, 16]}>
        <AppText size={16} weight="600">
          Thông báo
        </AppText>
        <Switch value={isSwitchOn} onValueChange={onToggleSwitch} />
      </AppBlock>
    </AppBlock>
  );
}
