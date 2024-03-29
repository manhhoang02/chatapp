import {appSize} from '@abong.code/config/AppConstant';
import {useAppContext} from '@abong.code/context/AppProvider';
import {consoleLog} from '@abong.code/helpers/logHelper';
import color from '@abong.code/theme/color';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {AppBlock, AppText} from '@starlingtech/element';
import {getAllChats} from 'app/api/chat';
import {ChatProps} from 'app/api/chat.type';
import LinearAvatar from 'app/components/LinearAvatar';
import {ParamsStack} from 'app/navigation/params';
import AppStyles from 'elements/AppStyles';
import React, {useEffect, useState} from 'react';
import {FlatList, TouchableOpacity} from 'react-native';
import {StyleSheet, Text, View} from 'react-native';

export default function () {
  const {user, socket, syncData} = useAppContext();
  const [chats, setChats] = useState<ChatProps[]>([]);
  const navigation = useNavigation<NativeStackNavigationProp<ParamsStack>>();

  const renderItem = ({item}: {item: ChatProps}) => {
    const friend = item.members.find(i => i._id !== user._id);
    const chatName = friend?.first_name + ' ' + friend?.last_name;
    const countImages = item.lastMessage
      ? item.lastMessage.files.filter(
          e => e.includes('.png') || e.includes('.jpg'),
        ).length
      : 0;
    const countVideos = item.lastMessage
      ? item.lastMessage.files.filter(
          e => e.includes('.mp4') || e.includes('.mov'),
        ).length
      : 0;

    const handlePress = () => {
      socket.emit('join-chat', item._id);
      navigation.navigate('ChatView', {
        chatId: item._id,
        chatName,
        avatar: friend!.avatar,
        friendId: friend!._id,
      });
    };
    return (
      <TouchableOpacity style={styles.cardChat} onPress={handlePress}>
        <LinearAvatar uri={friend?.avatar} size={58} />
        <AppBlock ml={4}>
          <Text style={styles.nameChat}>{chatName}</Text>
          {item.lastMessage &&
            (item.lastMessage.text ? (
              <Text style={styles.lastMessage}>{item.lastMessage.text}</Text>
            ) : (
              <Text style={styles.lastMessage} numberOfLines={1}>
                {item.lastMessage.senderId === user._id ? 'Bạn' : chatName} đã
                gửi {countImages > 0 ? countImages + ' ảnh' : ''}
                {countVideos > 0 ? countVideos + ' video' : ''}
              </Text>
            ))}
        </AppBlock>
      </TouchableOpacity>
    );
  };

  useEffect(() => {
    getAllChats(user._id, 10)
      .then(data => setChats(data))
      .catch(err => console.log(err));
  }, [user._id, syncData.chats]);
  useEffect(() => {
    socket.on('received-message', () => {
      getAllChats(user._id, 10)
        .then(data => {
          setChats(data);
          consoleLog(data);
        })
        .catch(err => console.log(err));
    });
  }, [socket, user._id]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tin nhắn</Text>
      <FlatList
        data={chats}
        keyExtractor={(_, index) => index.toString()}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={AppStyles.grow}
        ListEmptyComponent={
          <AppBlock flex center>
            <AppText size={50}>🤷‍♂️</AppText>
            <Text style={styles.titleEmpty}>
              Không có tin nhắn để hiển thị.
            </Text>
          </AppBlock>
        }
      />
    </View>
  );
}
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
