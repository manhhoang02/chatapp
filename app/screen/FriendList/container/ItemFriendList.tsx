import {appSize} from '@abong.code/config/AppConstant';
import color from '@abong.code/theme/color';
import {Friend} from 'app/api/auth.type';
import React, {useState} from 'react';
import {TouchableOpacity, Image, View, Text, StyleSheet} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {ParamsStack} from 'app/navigation/params';
import {createChat, getChat} from 'app/api/chat';
import {useAppContext} from '@abong.code/context/AppProvider';
import {consoleLog} from '@abong.code/helpers/logHelper';

type Props = {
  item: Friend;
  userSelect?: Friend;
  setUserSelect?: Function;
};
export default function ({item, setUserSelect, userSelect}: Props) {
  const {user} = useAppContext();
  const navigation =
    useNavigation<NativeStackNavigationProp<ParamsStack, 'TabScreen'>>();

  const [show, setShow] = useState(false);
  const handleShowAction = () => {
    setUserSelect && setUserSelect(item);
    if (item === userSelect) {
      setShow(!show);
    } else {
      setShow(true);
    }
  };
  const handleSendMsg = () => {
    consoleLog(user._id, item._id);
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
    navigation.navigate('Profile', {id: item._id});
  };
  return (
    <>
      <TouchableOpacity style={styles.card} onPress={handleShowAction}>
        <Image
          source={
            item?.avatar
              ? {uri: item?.avatar}
              : require('assets/image/profile.png')
          }
          style={styles.avatar}
        />
        <View style={styles.center}>
          <Text style={styles.nameChat}>
            {item.first_name + ' ' + item.last_name}
          </Text>
          <Text style={{color: color.black04}}>{item.email}</Text>
        </View>
      </TouchableOpacity>
      {userSelect === item && show && (
        <View style={styles.containerAction}>
          <TouchableOpacity
            style={styles.btnAction}
            onPress={handleNavigateProfile}>
            <View
              style={{
                padding: appSize(2),
                marginRight: appSize(5),
              }}>
              <Feather name="user" size={18} color={color.black} />
            </View>
            <Text style={{color: color.black}}>Xem trang cá nhân</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.btnAction, {marginTop: appSize(8)}]}
            onPress={handleSendMsg}>
            <View
              style={{
                padding: appSize(2),
                marginRight: appSize(5),
              }}>
              <AntDesign name="message1" size={18} color={color.black} />
            </View>
            <Text style={{color: color.black}}>Nhắn tin</Text>
          </TouchableOpacity>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: appSize(30),
  },
  nameChat: {
    fontSize: appSize(16),
    fontWeight: 'bold',
    marginBottom: appSize(5),
    color: color.black,
  },
  center: {justifyContent: 'center'},
  avatar: {
    height: appSize(50),
    width: appSize(50),
    borderRadius: appSize(50),
    marginRight: appSize(10),
  },
  containerAction: {
    borderLeftWidth: appSize(2),
    borderColor: color.primary,
    justifyContent: 'center',
    paddingLeft: appSize(10),
    marginBottom: appSize(15),
  },
  btnAction: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: appSize(4),
  },
});
