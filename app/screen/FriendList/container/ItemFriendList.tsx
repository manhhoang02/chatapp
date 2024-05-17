import {appSize} from '@abong.code/config/AppConstant';
import color from '@abong.code/theme/color';
import {Resp_User} from 'app/api/auth.type';
import React, {useRef} from 'react';
import {Text, StyleSheet} from 'react-native';
import LinearAvatar from 'app/components/LinearAvatar';
import {AppBlock, AppText, AppTouchableOpacity} from '@starlingtech/element';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ModalFriendActions from './ModalFriendActions';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {ParamsStack} from 'app/navigation/params';

type Props = {
  item: Resp_User;
};
export default function ({item}: Props) {
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const navigation =
    useNavigation<NativeStackNavigationProp<ParamsStack, 'TabScreen'>>();

  const handleShowAction = () => {
    bottomSheetRef.current?.present();
  };

  const handleNavigateProfile = () => {
    navigation.navigate('Profile', {id: item.id});
  };
  return (
    <>
      <AppBlock style={styles.card}>
        <LinearAvatar
          size={60}
          uri={item.avatar}
          onPress={handleNavigateProfile}
        />
        <AppBlock mt={6} flex ml={4}>
          <Text style={styles.nameChat}>
            {item.firstName + ' ' + item.lastName}
          </Text>
          <AppText size={14} color="black_70">
            {item.email}
          </AppText>
        </AppBlock>
        <AppTouchableOpacity justifyContent="center" onPress={handleShowAction}>
          <Ionicons name="ellipsis-horizontal" size={24} />
        </AppTouchableOpacity>
      </AppBlock>

      <ModalFriendActions bottomRef={bottomSheetRef} item={item} />
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingRight: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: color.secondary,
  },
  nameChat: {
    fontSize: appSize(16),
    fontWeight: 'bold',
    color: color.black,
  },
});
