import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import LinearAvatar from 'app/components/LinearAvatar';
import {AppBlock, appSize} from '@starlingtech/element';
import color from '@abong.code/theme/color';
import {ChatProps} from 'app/api/chat.type';
import {useGetUserById} from 'app/api/auth';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {ParamsStack} from 'app/navigation/params';
import useAuthStore from 'app/store/authStore';

type Props = {item: ChatProps};

const ChatItem = ({item}: Props) => {
  const {user} = useAuthStore();

  const navigation = useNavigation<NativeStackNavigationProp<ParamsStack>>();

  const {data: friend} = useGetUserById(item._id);

  const chatName = friend?.firstName + ' ' + friend?.lastName;
  // const countImages = item.lastMessage
  //   ? item.lastMessage.files.filter(
  //       e => e.includes('.png') || e.includes('.jpg'),
  //     ).length
  //   : 0;
  // const countVideos = item.lastMessage
  //   ? item.lastMessage.files.filter(
  //       e => e.includes('.mp4') || e.includes('.mov'),
  //     ).length
  //   : 0;

  const handlePress = () => {
    navigation.navigate('ChatView', {thread: item});
  };
  return (
    <TouchableOpacity style={styles.cardChat} onPress={handlePress}>
      <LinearAvatar uri={friend?.avatar} size={58} />
      <AppBlock ml={4}>
        <Text style={styles.nameChat}>{chatName}</Text>
        <Text style={styles.lastMessage}>{item.lastMessage}</Text>
      </AppBlock>
    </TouchableOpacity>
  );
};

export default ChatItem;

const styles = StyleSheet.create({
  titleEmpty: {
    textAlign: 'center',
    fontSize: appSize(16),
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: color.primary,
    marginVertical: 10,
  },

  container: {
    flex: 1,
    paddingHorizontal: 12,
    backgroundColor: color.white,
  },
  cardChat: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: appSize(15),
  },
  nameChat: {
    fontWeight: 'bold',
    marginBottom: appSize(2),
    fontSize: 17,
    color: color.black,
  },
  lastMessage: {
    color: '#909090',
  },
});
