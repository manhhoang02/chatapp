import React from 'react';
import {TouchableOpacity, StyleSheet} from 'react-native';
import {BottomTabBarProps} from '@react-navigation/bottom-tabs';
import color from '@abong.code/theme/color';
import IconMenu from 'assets/icons/tab/IconMenu';
import IconHome from 'assets/icons/tab/IconHome';
import IconUser from 'assets/icons/tab/IconUser';
import IconMessage from 'assets/icons/tab/IconMessage';
import Animated, {SlideInDown, SlideOutDown} from 'react-native-reanimated';

const tabIcon = [
  {
    icon: <IconHome />,
  },
  {
    icon: <IconUser />,
  },
  {
    icon: <IconMessage />,
  },
  {
    icon: <IconMenu />,
  },
];

export default function ({state, descriptors, navigation}: BottomTabBarProps) {
  return (
    <Animated.View style={styles.container}>
      {state.routes.map((route, index) => {
        const {options} = descriptors[route.key];

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <TouchableOpacity
            key={index}
            accessibilityRole="button"
            accessibilityState={isFocused ? {selected: true} : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.btnBottomTab}>
            {tabIcon[index].icon}
            {isFocused && (
              <Animated.View
                exiting={SlideOutDown}
                entering={SlideInDown}
                style={styles.line}
              />
            )}
          </TouchableOpacity>
        );
      })}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  line: {
    height: 3,
    width: '100%',
    backgroundColor: color.primary,
    borderRadius: 4,
    position: 'absolute',
    bottom: -10,
  },
  container: {
    position: 'absolute',
    borderRadius: 20,
    bottom: 16,
    right: 16,
    left: 16,
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    height: 76,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    borderWidth: 2,
    borderColor: '#CFAFE1',
  },
  btnBottomTab: {},
});
