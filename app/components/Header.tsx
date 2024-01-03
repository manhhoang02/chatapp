import {appSize} from '@abong.code/config/AppConstant';
import color from '@abong.code/theme/color';
import {BlurView} from '@react-native-community/blur';
import React, {ReactNode} from 'react';
import {View, Text, StyleSheet, TextInput, Animated} from 'react-native';

type Props = {
  left?: ReactNode;
  title?: string;
  right?: ReactNode;
  showSearch?: boolean;
  onChangeText?: (text: string) => void;
};
export default function ({
  title,
  left,
  right,
  showSearch,
  onChangeText,
}: Props) {
  return (
    <Animated.View
      style={[
        styles.container,
        {height: showSearch ? appSize(135) : appSize(100)},
      ]}>
      <BlurView
        style={styles.blur}
        blurType="light"
        blurAmount={21}
        overlayColor="transparent">
        <View style={styles.header}>
          <View style={styles.content}>
            {left}
            <Text style={styles.textTitle}>{title}</Text>
            {right}
          </View>
          {showSearch && (
            <View style={styles.textInputContainer}>
              <TextInput
                placeholder="Tìm kiếm"
                placeholderTextColor={color.black04}
                style={styles.textInput}
                onChangeText={onChangeText}
              />
            </View>
          )}
        </View>
      </BlurView>
    </Animated.View>
  );
}
const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    // height: appSize(100),
  },
  textTitle: {
    color: color.primary,
    fontWeight: 'bold',
    fontSize: appSize(26),
  },
  blur: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  header: {flex: 1, justifyContent: 'flex-end'},
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: appSize(16),
    alignItems: 'center',
  },
  textInputContainer: {
    height: appSize(35),
    borderRadius: appSize(20),
    paddingHorizontal: appSize(10),
    marginHorizontal: appSize(16),
    marginVertical: appSize(5),
    backgroundColor: color.black006,
  },
  textInput: {
    flex: 1,
    fontSize: appSize(14),
    padding: 0,
  },
});
