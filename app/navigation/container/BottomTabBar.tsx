import React from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import {BottomTabBarProps} from '@react-navigation/bottom-tabs';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import color from '@abong.code/theme/color';
import {appSize} from '@abong.code/config/AppConstant';
import {BlurView} from '@react-native-community/blur';

const tabIcon = [
  {
    icon: <Ionicons name="home-outline" size={26} color={'#909090'} />,
    iconFocus: <Ionicons name="home-outline" size={26} color={color.primary} />,
  },
  {
    icon: <Feather name="users" size={26} color={'#909090'} />,
    iconFocus: <Feather name="users" size={26} color={color.primary} />,
  },
  {
    icon: <Ionicons name="chatbox-outline" size={26} color={'#909090'} />,
    iconFocus: (
      <Ionicons name="chatbox-outline" size={26} color={color.primary} />
    ),
  },
  {
    icon: <Feather name="menu" size={26} color={'#909090'} />,
    iconFocus: <Feather name="menu" size={26} color={color.primary} />,
  },
];
export default function ({state, descriptors, navigation}: BottomTabBarProps) {
  const {bottom} = useSafeAreaInsets();
  return (
    <View
      style={[
        styles.container,
        {
          height: appSize(54) + (bottom || appSize(9)),
          // borderTopLeftRadius: appSize(8),
          // borderTopRightRadius: appSize(8),
        },
      ]}>
      <BlurView
        style={[styles.blur, {paddingBottom: bottom}]}
        blurType="light"
        blurAmount={21}
        overlayColor="transparent">
        <View style={[styles.flex, styles.row]}>
          {state.routes.map((route, index) => {
            const {options} = descriptors[route.key];
            // const label =
            //   options.tabBarLabel !== undefined
            //     ? options.tabBarLabel
            //     : options.title !== undefined
            //     ? options.title
            //     : route.name;

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
                {isFocused ? tabIcon[index].iconFocus : tabIcon[index].icon}
                {isFocused && <View style={styles.dot} />}
              </TouchableOpacity>
            );
          })}
        </View>
      </BlurView>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    left: 0,
  },
  row: {
    flexDirection: 'row',
  },
  btnBottomTab: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  blur: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
  },
  dot: {
    width: appSize(3),
    height: appSize(3),
    backgroundColor: color.primary,
    marginTop: appSize(5),
    borderRadius: appSize(3),
  },
  flex: {flex: 1},
});
