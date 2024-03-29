import color from '@abong.code/theme/color';
import React from 'react';
import {Text} from 'react-native';
import {StyleSheet, View} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import {AppBlock, AppTouchableOpacity, appSize} from '@starlingtech/element';
import AppStyles from 'elements/AppStyles';
import IconSearch from 'assets/icons/IconSearch';
import {useAppContext} from '@abong.code/context/AppProvider';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {TextInput} from 'react-native';
import light from 'vn.starlingTech/theme/color/light';
import {CompositeNavigationProp, useNavigation} from '@react-navigation/native';
import {MaterialTopTabNavigationProp} from '@react-navigation/material-top-tabs';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {ParamsStack, ParamsTopTab} from 'app/navigation/params';

type Props = {
  searchText: string;
  setSearchText: (text: string) => void;
  onAddIcon?: () => void;
};

type NavigationProps = CompositeNavigationProp<
  MaterialTopTabNavigationProp<ParamsTopTab, 'Tab2'>,
  NativeStackNavigationProp<ParamsStack>
>;

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);
const INPUT_HEIGHT = 40;

const FriendListHeader = (props: Props) => {
  const {user} = useAppContext();
  const {navigate} = useNavigation<NavigationProps>();

  const animInputHeight = useSharedValue(0);

  const onSearchIconPress = () => {
    animInputHeight.value =
      animInputHeight.value === INPUT_HEIGHT ? 0 : INPUT_HEIGHT;
  };

  const animInputStyle = useAnimatedStyle(() => ({
    height: withTiming(
      interpolate(animInputHeight.value, [0, INPUT_HEIGHT], [0, INPUT_HEIGHT]),
    ),
    opacity: withTiming(
      interpolate(animInputHeight.value, [0, INPUT_HEIGHT], [0, 1]),
    ),
  }));

  return (
    <View>
      <AppBlock pv={12} style={AppStyles.rowCenterBetween}>
        <Text style={styles.title}>Bạn bè</Text>
        <AppBlock row pr={10}>
          <AppTouchableOpacity
            mr={16}
            onPress={onSearchIconPress}
            style={styles.iconBtn}>
            <IconSearch color={color.primary} width={22} />
          </AppTouchableOpacity>
          <AppTouchableOpacity onPress={() => navigate('FriendRequests')}>
            <Feather name="user-plus" size={24} color={color.primary} />
            {user.friend_requests.length > 0 && (
              <View style={styles.badge}>
                <Text style={styles.textBadge}>
                  {user.friend_requests.length <= 99
                    ? user.friend_requests.length
                    : 99}
                </Text>
              </View>
            )}
          </AppTouchableOpacity>
        </AppBlock>
      </AppBlock>

      <Animated.View style={[animInputStyle, styles.inputContainer]}>
        <IconSearch width={16} color={light.black_70} />
        <AnimatedTextInput
          value={props.searchText}
          onChangeText={props.setSearchText}
          placeholder="Tìm kiếm bạn bè"
          placeholderTextColor={light.black_70}
          style={[animInputStyle, styles.input]}
        />
      </Animated.View>
    </View>
  );
};

export default FriendListHeader;

const styles = StyleSheet.create({
  iconBtn: {
    borderRadius: 6,
    height: 28,
    width: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    width: '100%',
    borderRadius: 20,
    paddingHorizontal: 8,
  },
  inputContainer: {
    backgroundColor: light.light_gray,
    borderRadius: 20,
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 12,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: color.primary,
  },
  badge: {
    backgroundColor: color.red,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: appSize(100),
    position: 'absolute',
    right: -10,
    top: -15,
    width: appSize(20),
    height: appSize(20),
  },
  textBadge: {
    fontSize: appSize(12),
    color: color.white,
    fontWeight: 'bold',
  },
});
