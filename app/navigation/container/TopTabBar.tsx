import {MaterialTopTabBarProps} from '@react-navigation/material-top-tabs';
import IconHome from 'assets/icons/tab/IconHome';
import IconMenu from 'assets/icons/tab/IconMenu';
import IconMessage from 'assets/icons/tab/IconMessage';
import IconNotification from 'assets/icons/tab/IconNotification';
import IconUser from 'assets/icons/tab/IconUser';
import React, {cloneElement} from 'react';

import {View, TouchableOpacity, StyleSheet} from 'react-native';

const tabIcon = [
  <IconHome />,
  <IconUser />,
  <IconNotification />,
  <IconMessage />,
  <IconMenu />,
];

export default function ({
  state,
  descriptors,
  navigation,
}: MaterialTopTabBarProps) {
  return (
    <View style={styles.container}>
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
            navigation.navigate(route.name, route.params);
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
            onLongPress={onLongPress}>
            {cloneElement(tabIcon[index], {isFocused})}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 55,
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderColor: '#CFAFE1',
  },
});
