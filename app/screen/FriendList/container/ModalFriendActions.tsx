import {StyleSheet, Text} from 'react-native';
import React from 'react';
import BottomSheetContainer from 'app/components/Global/BottomSheetContainer';
import {BottomSheetModalMethods} from '@gorhom/bottom-sheet/lib/typescript/types';
import {Friend} from 'app/api/auth.type';
import {
  AppBlock,
  AppText,
  AppTouchableOpacity,
  appSize,
} from '@starlingtech/element';
import LinearAvatar from 'app/components/LinearAvatar';
import color from '@abong.code/theme/color';
import AppStyles from 'elements/AppStyles';
import Ionicons from 'react-native-vector-icons/Ionicons';
import light from 'vn.starlingTech/theme/color/light';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {ParamsStack} from 'app/navigation/params';
import {createChat, getChat} from 'app/api/chat';
import {useAppContext} from '@abong.code/context/AppProvider';

type Props = {
  bottomRef: React.RefObject<BottomSheetModalMethods>;
  item: Friend;
};

const BUTTON_HEIGHT = 58;
const CARD_HEIGHT = 68;

const PRE_HEIGHT = BUTTON_HEIGHT * 2 + CARD_HEIGHT + 25;
const SUF_HEIGHT = PRE_HEIGHT + BUTTON_HEIGHT;

export default function ModalFriendActions({bottomRef, item}: Props) {
  const {user} = useAppContext();
  const navigation =
    useNavigation<NativeStackNavigationProp<ParamsStack, 'TabScreen'>>();

  const handleSendMsg = () => {
    bottomRef.current?.close();

    getChat(user._id, item._id)
      .then(res => {
        if (res) {
          navigation.navigate('ChatView', {
            chatId: res._id,
            chatName: item.first_name + ' ' + item.last_name,
            avatar: item?.avatar,
            friendId: item._id,
          });
        } else {
          createChat(user._id, item._id)
            .then(resp => {
              navigation.navigate('ChatView', {
                chatId: resp._id,
                chatName: item.first_name + ' ' + item.last_name,
                avatar: item?.avatar,
                friendId: item._id,
              });
            })
            .catch();
        }
      })
      .catch();
  };

  const handleNavigateProfile = () => {
    bottomRef.current?.close();
    setTimeout(() => {
      navigation.navigate('Profile', {id: item._id});
    }, 200);
  };
  return (
    <BottomSheetContainer
      bottomRef={bottomRef}
      snapPoints={[PRE_HEIGHT, SUF_HEIGHT]}
      disappearsOnIndex={2}>
      <AppBlock style={styles.card}>
        <LinearAvatar size={48} uri={item.avatar} disabled />
        <AppBlock flex ml={4}>
          <Text style={styles.nameChat}>
            {item.first_name + ' ' + item.last_name}
          </Text>
          <AppText size={12} color="black_70">
            {item.email}
          </AppText>
        </AppBlock>
      </AppBlock>

      <AppBlock flex ph={12}>
        <AppTouchableOpacity style={styles.btn} onPress={handleSendMsg}>
          <Ionicons
            name="chatbubble-ellipses-outline"
            size={30}
            style={styles.mr10}
          />
          <Text style={styles.text}>Nhắn tin cho {item.last_name}</Text>
        </AppTouchableOpacity>
        <AppTouchableOpacity style={styles.btn} onPress={handleNavigateProfile}>
          <Ionicons
            name="person-circle-outline"
            size={30}
            style={styles.mr10}
          />
          <Text style={styles.text}>Trang cá nhân của {item.last_name}</Text>
        </AppTouchableOpacity>
        <AppTouchableOpacity style={styles.btn}>
          <Ionicons
            name="person-remove-outline"
            size={28}
            color={light.red}
            style={styles.mr10}
          />
          <AppBlock>
            <Text style={[styles.text, {color: light.red}]}>
              Hủy kết bạn với {item.last_name}
            </Text>
            <AppText size={12} color="black_70">
              Xóa {item.last_name} khỏi danh sách bạn bè
            </AppText>
          </AppBlock>
        </AppTouchableOpacity>
      </AppBlock>
    </BottomSheetContainer>
  );
}

const styles = StyleSheet.create({
  mr10: {marginRight: 10},
  text: {
    fontSize: 16,
    fontWeight: '500',
    color: color.black,
  },
  btn: {
    ...AppStyles.rowCenter,
    height: BUTTON_HEIGHT,
  },
  card: {
    flexDirection: 'row',
    height: CARD_HEIGHT,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: color.secondary,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  nameChat: {
    fontSize: appSize(14),
    fontWeight: 'bold',
    color: color.black,
  },
});
