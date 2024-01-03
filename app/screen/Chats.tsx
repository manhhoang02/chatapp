import {appSize} from '@abong.code/config/AppConstant';
import {useAppContext} from '@abong.code/context/AppProvider';
import {consoleLog} from '@abong.code/helpers/logHelper';
import color from '@abong.code/theme/color';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {getAllChats} from 'app/api/chat';
import {ChatProps} from 'app/api/chat.type';
import Header from 'app/components/Header';
import {ParamsStack} from 'app/navigation/params';
import React, {useEffect, useState} from 'react';
import {FlatList, Image, TouchableOpacity} from 'react-native';
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
        )
      : [];
    const countVideos = item.lastMessage
      ? item.lastMessage.files.filter(
          e => e.includes('.mp4') || e.includes('.mov'),
        )
      : [];

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
        <Image
          source={
            friend?.avatar
              ? {uri: friend?.avatar}
              : require('assets/image/profile.png')
          }
          style={styles.avatar}
        />
        <View>
          <Text style={styles.nameChat}>{chatName}</Text>
          {item.lastMessage &&
            (item.lastMessage.text ? (
              <Text style={styles.lastMessage}>{item.lastMessage.text}</Text>
            ) : (
              <Text style={styles.lastMessage}>
                {item.lastMessage.senderId === user._id ? 'Bạn' : chatName} đã
                gửi {countImages.length > 0 ? countImages?.length + ' ảnh' : ''}
                {countVideos.length > 0 ? countVideos?.length + ' video' : ''}
              </Text>
            ))}
        </View>
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
      <View style={styles.boxChats}>
        <FlatList
          data={chats}
          keyExtractor={(_, index) => index.toString()}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingTop: appSize(116),
            paddingBottom: appSize(80),
          }}
        />
      </View>
      <Header title="Tin nhắn" />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  boxChats: {
    flex: 1,
    paddingHorizontal: appSize(16),
  },
  avatar: {
    height: appSize(50),
    width: appSize(50),
    borderRadius: appSize(50),
    marginRight: appSize(10),
  },
  cardChat: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: appSize(15),
  },
  nameChat: {
    fontWeight: 'bold',
    marginBottom: appSize(5),
    color: color.black,
  },
  lastMessage: {
    color: '#909090',
  },
});
