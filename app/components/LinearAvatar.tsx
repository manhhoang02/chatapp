import {
  Image,
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import React from 'react';
import {GradientBorderView} from '@good-react-native/gradient-border';
import IconGreenDot from 'assets/icons/IconGreenDot';
import {AppBlock} from '@starlingtech/element';
import IconAdd from 'assets/icons/IconAdd';

type Props = {
  uri?: string;
  name?: string;
  size?: number;
  online?: boolean;
  add?: boolean;
  onPress?: () => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

export default function LinearAvatar({
  uri,
  name,
  size = 67,
  online,
  add,
  onPress,
  disabled,
  style,
}: Props) {
  return (
    <AppBlock alignItems="center" width={size} style={style} mr={6}>
      <TouchableOpacity
        activeOpacity={0.6}
        disabled={disabled}
        onPress={onPress}>
        <GradientBorderView
          gradientProps={{
            colors: ['#5334C7', '#C79BE7'],
          }}
          style={[
            styles.borderView,
            {height: size, width: size, borderRadius: size},
          ]}>
          <Image
            source={uri ? {uri} : require('assets/image/profile.png')}
            resizeMode="cover"
            style={[styles.img, {borderRadius: size / 2}]}
          />
          {add && <IconAdd style={styles.add} />}
          {online && (
            <IconGreenDot
              width={size / 5}
              style={[styles.dot, {right: size / 4}]}
            />
          )}
        </GradientBorderView>
      </TouchableOpacity>

      {name && <Text style={styles.text}>{name}</Text>}
    </AppBlock>
  );
}

const styles = StyleSheet.create({
  text: {fontSize: 15, color: 'black', fontWeight: '500', marginTop: 5},
  img: {height: '100%', width: '100%'},
  add: {
    position: 'absolute',
    bottom: -8,
    alignSelf: 'center',
    zIndex: 2,
  },
  borderView: {
    borderWidth: 2,
    padding: 3,
    zIndex: 1,
  },
  dot: {position: 'absolute', bottom: 0, zIndex: 99},
  grediant: {
    height: 44,
    width: 300,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  buttonContainer: {
    flex: 1.0,
    alignSelf: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    width: '99%',
    margin: 1,
  },
  buttonText: {
    textAlign: 'center',
    color: '#4C64FF',
    alignSelf: 'center',
  },
});
