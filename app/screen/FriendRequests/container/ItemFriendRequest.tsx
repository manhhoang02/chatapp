import {appSize} from '@abong.code/config/AppConstant';
import {useAppContext} from '@abong.code/context/AppProvider';
import {showToastMessageError} from '@abong.code/helpers/messageHelper';
import color from '@abong.code/theme/color';
import {getProfileMe, useAddFriend} from 'app/api/auth';
import {Friend} from 'app/api/auth.type';
import moment from 'moment';
import React from 'react';
import {TouchableOpacity, Image, View, Text, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {ParamsStack} from 'app/navigation/params';

type Props = {
  item: Friend;
  setReload: Function;
};
export default function ({item, setReload}: Props) {
  const {user, setUser, socket} = useAppContext();
  const navigation =
    useNavigation<NativeStackNavigationProp<ParamsStack, 'TabScreen'>>();

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
    <>
      <TouchableOpacity style={styles.card} onPress={handleNavigateProfile}>
        <Image
          source={
            item?.avatar
              ? {uri: item?.avatar}
              : require('assets/image/profile.png')
          }
          style={styles.avatar}
        />
        <View>
          <Text style={styles.nameChat}>
            {item.first_name + ' ' + item.last_name}
          </Text>
          <View style={styles.boxBtn}>
            <TouchableOpacity
              onPress={handleAccept}
              style={[styles.btn, {backgroundColor: color.primary}]}>
              <Text style={[{color: color.white}, styles.textBtn]}>
                Xác nhận
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.btn, {backgroundColor: color.border}]}>
              <Text style={[{color: color.red}, styles.textBtn]}>Xoá</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: appSize(40),
  },
  nameChat: {
    fontSize: appSize(16),
    fontWeight: 'bold',
    marginBottom: appSize(5),
    color: color.black,
  },
  boxBtn: {flexDirection: 'row'},
  avatar: {
    height: appSize(50),
    width: appSize(50),
    borderRadius: appSize(50),
    marginRight: appSize(10),
  },
  btn: {
    padding: appSize(5),
    borderRadius: appSize(5),
    marginRight: appSize(20),
    width: appSize(100),
    alignItems: 'center',
  },
  textBtn: {
    fontWeight: '600',
  },
});
