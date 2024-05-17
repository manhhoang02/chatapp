import {appSize} from '@abong.code/config/AppConstant';
import color from '@abong.code/theme/color';
import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {View, Text} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useAppContext} from '@abong.code/context/AppProvider';
import LinearAvatar from 'app/components/LinearAvatar';
import useAuthStore from 'app/store/authStore';
import {useGetUserById} from 'app/api/auth';

type PropsType = {
  friendId: string;
};
export default function ({friendId}: PropsType) {
  const {data} = useGetUserById(friendId);
  const navigation = useNavigation();
  const handleBack = () => {
    navigation.goBack();
  };
  const handleCallVideo = () => {};
  return (
    <View style={styles.header}>
      <View style={styles.row}>
        <TouchableOpacity onPress={handleBack}>
          <Ionicons
            name="arrow-back"
            size={appSize(25)}
            color={color.primary}
          />
        </TouchableOpacity>
        <LinearAvatar size={45} style={styles.ml8} uri={data?.avatar} />
        <Text style={styles.nameHeader} numberOfLines={1}>
          {data?.firstName + ' ' + data?.lastName}
        </Text>
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
  );
}
const styles = StyleSheet.create({
  ml8: {marginLeft: 8},
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: appSize(16),
    justifyContent: 'space-between',
    backgroundColor: 'white',
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: color.primary,
  },
  nameHeader: {
    fontWeight: 'bold',
    marginLeft: appSize(8),
    fontSize: appSize(18),
    color: color.primary,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
