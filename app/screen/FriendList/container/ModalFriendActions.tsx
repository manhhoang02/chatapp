import {Alert, StyleSheet, Text} from 'react-native';
import React from 'react';
import BottomSheetContainer from 'app/components/Global/BottomSheetContainer';
import {BottomSheetModalMethods} from '@gorhom/bottom-sheet/lib/typescript/types';
import {Resp_User} from 'app/api/auth.type';
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
import light from 'starling/theme/color/light';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {ParamsStack} from 'app/navigation/params';
import useAuthStore from 'app/store/authStore';
import {getUserById, useDeleteFriend} from 'app/api/auth';
import {
  showToastMessageError,
  showToastMessageSuccess,
} from '@abong.code/helpers/messageHelper';
import {useHomeStore} from 'app/store/homeStore';
import moment from 'moment';
import {shallow} from 'zustand/shallow';
import {useChatContext} from 'app/components/chat/ChatContext';
import {chatClient} from 'app/hook/useChatClient';

type Props = {
  bottomRef: React.RefObject<BottomSheetModalMethods>;
  item: Resp_User;
};

const BUTTON_HEIGHT = 58;
const CARD_HEIGHT = 68;

const PRE_HEIGHT = BUTTON_HEIGHT * 2 + CARD_HEIGHT + 25;
const SUF_HEIGHT = PRE_HEIGHT + BUTTON_HEIGHT;

export default function ModalFriendActions({bottomRef, item}: Props) {
  const [user, dispatchUser] = useAuthStore(
    s => [s.user, s.dispatchUser],
    shallow,
  );
  const {setChannel} = useChatContext();

  const navigation = useNavigation<NativeStackNavigationProp<ParamsStack>>();

  const dispatchSync = useHomeStore(s => s.dispatchSync);

  const {mutate} = useDeleteFriend();

  const handleDeleteFriend = () => {
    Alert.alert(
      'Thồng báo',
      'Bạn có muốn xóa ' + item.lastName + ' khỏi danh sách bạn bè không?',
      [
        {text: 'Hủy', style: 'cancel'},
        {
          text: 'Đồng ý',
          onPress: () => {
            mutate(
              {friendId: item.id, userId: user.id},
              {
                onSuccess: () => {
                  showToastMessageSuccess(
                    'Thành công!',
                    'Xóa bạn bè thành công',
                  );
                  bottomRef.current?.close();
                  getUserById(user.id).then(res => {
                    dispatchUser({...user, ...res});
                  });
                  dispatchSync({friend: moment().unix()});
                },
                onError: () => {
                  showToastMessageError('Lỗi!', 'Xóa bạn bè thất bại');
                },
              },
            );
          },
        },
      ],
    );
  };

  const handleSendMsg = async () => {
    const friend = await getUserById(item.id);
    const channel = chatClient.channel('messaging', {
      members: [user.id, item.id],
      name: friend.firstName + ' ' + friend.lastName,
    });

    setChannel(channel);
    bottomRef.current?.close();
    navigation.navigate('ChannelScreen');
  };

  const handleNavigateProfile = () => {
    bottomRef.current?.close();
    setTimeout(() => {
      navigation.navigate('Profile', {id: item.id});
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
            {item.firstName + ' ' + item.lastName}
          </Text>
          <AppText size={12} style={{color: light.black_70}}>
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
          <Text style={styles.text}>Nhắn tin cho {item.lastName}</Text>
        </AppTouchableOpacity>
        <AppTouchableOpacity style={styles.btn} onPress={handleNavigateProfile}>
          <Ionicons
            name="person-circle-outline"
            size={30}
            style={styles.mr10}
          />
          <Text style={styles.text}>Trang cá nhân của {item.lastName}</Text>
        </AppTouchableOpacity>
        <AppTouchableOpacity style={styles.btn} onPress={handleDeleteFriend}>
          <Ionicons
            name="person-remove-outline"
            size={28}
            color={light.red}
            style={styles.mr10}
          />
          <AppBlock>
            <Text style={[styles.text, {color: light.red}]}>
              Hủy kết bạn với {item.lastName}
            </Text>
            <AppText size={12} style={{color: light.black_70}}>
              Xóa {item.lastName} khỏi danh sách bạn bè
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
