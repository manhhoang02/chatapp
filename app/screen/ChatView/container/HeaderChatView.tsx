import {appSize} from '@abong.code/config/AppConstant';
import color from '@abong.code/theme/color';
import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {View, Image, Text} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useAppContext} from '@abong.code/context/AppProvider';

type PropsType = {
  name: string;
  avatar?: string;
  friendId: string;
};
export default function ({name, avatar, friendId}: PropsType) {
  const {socket, user, setShowModalCallVideo} = useAppContext();
  const {top} = useSafeAreaInsets();
  const navigation = useNavigation();
  const handleBack = () => {
    navigation.goBack();
  };
  const handleCallVideo = () => {
    socket.emit('call', {
      friendId,
      userId: user._id,
      avatarCaller: user.avatar,
      nameCaller: user.first_name + ' ' + user.last_name,
      avatarCallee: avatar,
      nameCallee: name,
    });
    setShowModalCallVideo(true);
  };
  return (
    <View style={[styles.container, {height: top + appSize(50)}]}>
      <View style={[styles.header, {paddingTop: top}]}>
        <View style={styles.row}>
          <TouchableOpacity onPress={handleBack}>
            <Ionicons
              name="arrow-back"
              size={appSize(25)}
              color={color.primary}
            />
          </TouchableOpacity>
          <Image
            source={
              avatar ? {uri: avatar} : require('assets/image/profile.png')
            }
            style={styles.avatar}
            resizeMode="cover"
          />
          <Text style={styles.nameHeader}>{name}</Text>
        </View>
        <View style={styles.row}>
          <TouchableOpacity onPress={handleCallVideo}>
            <FontAwesome
              name="video-camera"
              size={appSize(23)}
              color={color.primary}
            />
          </TouchableOpacity>
          <MaterialCommunityIcons
            name="information"
            size={appSize(25)}
            color={color.primary}
            style={{marginLeft: appSize(20)}}
          />
        </View>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    backgroundColor: color.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: appSize(16),
    justifyContent: 'space-between',
  },
  avatar: {
    height: appSize(45),
    width: appSize(45),
    marginLeft: appSize(10),
    borderRadius: appSize(45),
  },
  nameHeader: {
    fontWeight: 'bold',
    marginLeft: appSize(8),
    fontSize: appSize(18),
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  blur: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'flex-end',
  },
});
