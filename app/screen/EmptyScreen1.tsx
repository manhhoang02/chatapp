import {Button, Text, View} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import AppStyles from 'elements/AppStyles';

export default function EmptyScreen1() {
  const {goBack} = useNavigation();
  return (
    <View style={[AppStyles.fill, AppStyles.center]}>
      <Button title="back" onPress={goBack} />
      <Text>EmptyScreen1</Text>
    </View>
  );
}
