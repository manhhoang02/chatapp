import {appSize} from '@abong.code/config/AppConstant';
import {
  showToastMessageError,
  showToastMessageSuccess,
} from '@abong.code/helpers/messageHelper';
import color from '@abong.code/theme/color';
import {getUserById, useAddFriend, useDeleteFriendRequest} from 'app/api/auth';
import {Resp_User} from 'app/api/auth.type';
import moment from 'moment';
import React from 'react';
import {TouchableOpacity, Text, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {ParamsStack} from 'app/navigation/params';
import LinearAvatar from 'app/components/LinearAvatar';
import {AppBlock} from '@starlingtech/element';
import light from 'vn.starlingTech/theme/color/light';
import useAuthStore from 'app/store/authStore';
import {useHomeStore} from 'app/store/homeStore';
import {shallow} from 'zustand/shallow';

type Props = {
  item: Resp_User;
};
export default function ({item}: Props) {
  const [user, dispatchUser] = useAuthStore(
    s => [s.user, s.dispatchUser],
    shallow,
  );
  const dispatchSync = useHomeStore(s => s.dispatchSync);
  const navigation = useNavigation<NativeStackNavigationProp<ParamsStack>>();

  const {mutate: acceptR} = useAddFriend();
  const {mutate: deleteR} = useDeleteFriendRequest();
  const handleNavigateProfile = () => {
    navigation.navigate('Profile', {id: item.id});
  };

  const params = {friendId: item.id, userId: user.id};

  const handleAccept = () => {
    acceptR(params, {
      onSuccess: response => {
        showToastMessageSuccess(response.message);
        dispatchSync({friend: moment().unix()});
        getUserById(user.id).then(res => {
          dispatchUser({...user, ...res});
        });
        navigation.goBack();
      },
      onError: () => {
        showToastMessageError(
          'Lỗi',
          'Không thể thêm bạn bè. Không tìm thấy yêu cầu.',
        );
      },
    });
  };

  const handleDelete = () => {
    deleteR(params, {
      onSuccess: response => {
        showToastMessageSuccess(response.message);
        getUserById(user.id).then(res => {
          dispatchUser({...user, ...res});
        });
        dispatchSync({friend: moment().unix()});
      },
      onError: () => {
        showToastMessageError('Lỗi', 'Không thể xóa bạn bè.');
      },
    });
  };

  return (
    <TouchableOpacity style={styles.card} onPress={handleNavigateProfile}>
      <LinearAvatar uri={item.avatar} size={80} disabled />

      <AppBlock ml={6} flex>
        <Text style={styles.nameChat}>
          {item.firstName + ' ' + item.lastName}
        </Text>

        <AppBlock row mt={10}>
          <TouchableOpacity
            onPress={handleAccept}
            style={[styles.btn, {backgroundColor: color.primary}]}>
            <Text style={[{color: color.white}, styles.textBtn]}>
              Chấp nhận
            </Text>
          </TouchableOpacity>

          <AppBlock width={10} />

          <TouchableOpacity
            onPress={handleDelete}
            style={[styles.btn, {backgroundColor: color.border}]}>
            <Text style={[{color: light.gray}, styles.textBtn]}>Xoá</Text>
          </TouchableOpacity>
        </AppBlock>
      </AppBlock>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: appSize(12),
  },
  nameChat: {
    fontSize: appSize(14),
    fontWeight: 'bold',
    color: color.black,
  },
  btn: {
    borderRadius: appSize(8),
    justifyContent: 'center',
    flex: 1,
    height: 34,
    alignItems: 'center',
  },
  textBtn: {
    fontSize: 15,
    fontWeight: '600',
  },
});
