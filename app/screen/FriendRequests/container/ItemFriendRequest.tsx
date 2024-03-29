import {appSize} from '@abong.code/config/AppConstant';
import {useAppContext} from '@abong.code/context/AppProvider';
import {showToastMessageError} from '@abong.code/helpers/messageHelper';
import color from '@abong.code/theme/color';
import {getProfileMe, useAddFriend} from 'app/api/auth';
import {Friend} from 'app/api/auth.type';
import moment from 'moment';
import React from 'react';
import {TouchableOpacity, Text, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {ParamsStack} from 'app/navigation/params';
import LinearAvatar from 'app/components/LinearAvatar';
import {AppBlock} from '@starlingtech/element';
import light from 'vn.starlingTech/theme/color/light';

type Props = {
  item: Friend;
  setReload: Function;
};
export default function ({item, setReload}: Props) {
  const {user, setUser, socket} = useAppContext();
  const navigation = useNavigation<NativeStackNavigationProp<ParamsStack>>();

  const {mutate: acceptFriend} = useAddFriend();
  const handleNavigateProfile = () => {
    navigation.navigate('Profile', {id: item._id});
  };
  const handleAccept = () => {
    acceptFriend(item!._id, {
      onSuccess: () => {
        socket.emit('change-relationship', item._id);
        getProfileMe().then(res => {
          setUser({...user, ...res});
        });
        setReload(moment().unix());
      },
      onError: () => {
        showToastMessageError('Lỗi', 'Đã xảy ra lỗi');
      },
    });
  };

  return (
    <TouchableOpacity style={styles.card} onPress={handleNavigateProfile}>
      <LinearAvatar uri={item.avatar} size={80} disabled />

      <AppBlock ml={6} flex>
        <Text style={styles.nameChat}>
          {item.first_name + ' ' + item.last_name}
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
