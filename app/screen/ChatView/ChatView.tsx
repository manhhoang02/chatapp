import color from '@abong.code/theme/color';
import React, {useEffect, useState} from 'react';
import {StyleSheet, View, TouchableOpacity, FlatList} from 'react-native';
import HeaderChatView from './container/HeaderChatView';
import {
  GiftedChat,
  IMessage,
  InputToolbar,
  InputToolbarProps,
  MessageImage,
  MessageImageProps,
  MessageVideoProps,
  Send,
  SendProps,
} from 'react-native-gifted-chat';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {appSize} from '@abong.code/config/AppConstant';
import {useAppContext} from '@abong.code/context/AppProvider';
import {getAllMessages, sendMessage} from 'app/api/chat';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {ParamsStack} from 'app/navigation/params';
import moment from 'moment';
import DocumentPicker from 'react-native-document-picker';
import Video from 'react-native-video';

export default function ({
  route,
}: NativeStackScreenProps<ParamsStack, 'ChatView'>) {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [message, setMessage] = useState('');
  // const [isTyping, setIsTyping] = useState(false);
  const {user, socket, dispatchSyncData, syncData} = useAppContext();

  // consoleLog(isTyping);

  const onSend = () => {
    const params = new FormData();
    params.append('chatId', route.params.chatId);
    params.append('senderId', user._id);
    params.append('text', message);
    sendMessage(params).then(res => {
      setMessage('');
      const cloneMessages = [...messages];
      cloneMessages.unshift({
        _id: res._id,
        text: res.text,
        createdAt: new Date(res.createdAt),
        user: {
          _id: user._id,
        },
      });
      setMessages(cloneMessages);
      socket.emit('send-message', {
        _id: res._id,
        text: message,
        createdAt: res.createdAt,
        user: {
          _id: user._id,
          avatar: user.avatar,
          name: user.first_name + ' ' + user.last_name,
        },
        chatId: res.chatId,
        receiveId: route.params.friendId,
      });
    });
  };

  const selectMultipleFile = async () => {
    try {
      const results = await DocumentPicker.pickMultiple({
        allowMultiSelection: true,
        type: [DocumentPicker.types.video, DocumentPicker.types.images],
      });
      const params = new FormData();
      for (let result of results) {
        params.append('files', result);
      }
      params.append('chatId', route.params.chatId);
      params.append('senderId', user._id);

      sendMessage(params).then(res => {
        setMessage('');
        const cloneMessages = [...messages];
        cloneMessages.unshift({
          _id: res._id,
          text: res.text,
          image: res.files
            .filter(e => e.includes('.png') || e.includes('.jpg'))
            .toString(),
          video: res.files
            .filter(e => e.includes('.mp4') || e.includes('.mov'))
            .toString(),
          createdAt: new Date(res.createdAt),
          user: {
            _id: user._id,
            avatar: user.avatar,
          },
        });
        setMessages(cloneMessages);
        socket.emit('send-message', {
          _id: res._id,
          text: res.text,
          createdAt: res.createdAt,
          image: res.files
            .filter(e => e.includes('.png') || e.includes('.jpg'))
            .toString(),
          video: res.files
            .filter(e => e.includes('.mp4') || e.includes('.mov'))
            .toString(),
          user: {
            _id: res.senderId,
            avatar: user.avatar,
            name: user.first_name + ' ' + user.last_name,
          },
          chatId: res.chatId,
          receiveId: route.params.friendId,
        });
      });
    } catch (error) {
      if (DocumentPicker.isCancel(error)) {
        // Alert.alert('Canceled from MultipleFile picker')
      } else {
        // Alert.alert('unknown error: ' + JSON.stringify(err))
        throw error;
      }
    }
  };

  const renderSend = (props: SendProps<IMessage>) => {
    return (
      <Send disabled={!message} {...props}>
        <Ionicons
          name="send-sharp"
          size={30}
          color={message ? color.primary : color.disabled}
        />
      </Send>
    );
  };

  const renderInputToolbar = (props: InputToolbarProps<IMessage>) => {
    return (
      <InputToolbar {...props} containerStyle={styles.inputToolBarContainer} />
    );
  };
  const renderActions = () => {
    return (
      <TouchableOpacity
        style={{marginLeft: appSize(10), alignSelf: 'center'}}
        onPress={selectMultipleFile}>
        <FontAwesome5 name="file-image" size={24} color={color.primary} />
      </TouchableOpacity>
    );
  };

  const renderMessageImage = (props: MessageImageProps<IMessage>) => {
    const imgs = props.currentMessage?.image?.split(',');
    const renderItem = ({item}: {item: string}) => {
      const propsNew: MessageImageProps<IMessage> = {
        ...props,
        currentMessage: {...props.currentMessage, image: item},
      };
      return (
        <MessageImage {...propsNew} containerStyle={styles.imageContainer} />
      );
    };

    return (
      <View>
        <FlatList
          numColumns={2}
          data={imgs}
          keyExtractor={(_, index) => index.toString()}
          renderItem={renderItem}
          style={
            props.currentMessage?.user._id !== user._id
              ? styles.flexStart
              : styles.flexEnd
          }
        />
      </View>
    );
  };
  const renderMessageVideo = (props: MessageVideoProps<IMessage>) => {
    const videos = props.currentMessage?.video?.split(',');
    const renderItem = ({item}: {item: string}) => {
      return (
        <Video
          controls={true}
          source={{
            uri: item,
          }}
          style={{
            width: appSize(300),
            height: appSize(150),
          }}
          resizeMode={'contain'}
        />
      );
    };

    return (
      <View>
        <FlatList
          data={videos}
          keyExtractor={(_, index) => index.toString()}
          renderItem={renderItem}
        />
      </View>
    );
  };

  useEffect(() => {
    getAllMessages(route.params.chatId).then(response => {
      const msg: IMessage[] = [];

      response.forEach(res => {
        msg.push({
          _id: res._id,
          text: res.text,
          image: res.files
            .filter(e => e.includes('.png') || e.includes('.jpg'))
            .toString(),
          video: res.files
            .filter(e => e.includes('.mp4') || e.includes('.mov'))
            .toString(),
          createdAt: new Date(res.createdAt),
          user: {
            _id: res.sender._id,
            name: res.sender.first_name + ' ' + res.sender.last_name,
            avatar: res.sender.avatar
              ? res.sender.avatar
              : require('assets/image/profile.png'),
          },
        });
      });
      setMessages(msg);
    });
  }, [route.params.chatId]);

  useEffect(() => {
    return () => {
      socket.emit('leave-chat', route.params.chatId);
      dispatchSyncData({...syncData, chats: moment().unix()});
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // useEffect(() => {
  //   if (isTyping) {
  //     setTimeout(() => {
  //       setIsTyping(false);
  //     }, 1000);
  //   }
  // }, [isTyping]);
  useEffect(() => {
    socket.on('received-message', dataMessage => {
      if (route.params.chatId === dataMessage.chatId) {
        const cloneMessages = [...messages];
        cloneMessages.unshift({
          _id: dataMessage._id,
          text: dataMessage.text,
          image: dataMessage.image,
          video: dataMessage.video,
          createdAt: dataMessage.createdAt,
          user: {
            _id: dataMessage.user._id,
            avatar: dataMessage.user.avatar
              ? dataMessage.user.avatar
              : require('assets/image/profile.png'),
          },
        });
        setMessages(cloneMessages);
      }
    });
    // socket.on('typing', () => {
    //   setIsTyping(true);
    // });
    // socket.on('not-typing', () => {
    //   setIsTyping(false);
    // });
  }, [socket, messages, route.params.chatId]);

  return (
    <View style={styles.container}>
      <View style={styles.container}>
        <GiftedChat
          messages={messages}
          user={{
            _id: user._id,
          }}
          renderInputToolbar={renderInputToolbar}
          renderActions={renderActions}
          renderMessageImage={renderMessageImage}
          renderMessageVideo={renderMessageVideo}
          alignTop={true}
          // minInputToolbarHeight={0}
          // isTyping={isTyping}
          alwaysShowSend
          renderSend={renderSend}
          scrollToBottom
          onSend={onSend}
          onInputTextChanged={text => {
            setMessage(text);
            // if (!isTyping && text) {
            //   socket.emit('typing', route.params.chatId);
            // }
          }}
          textInputProps={styles.textInputProps}
        />
      </View>
      <HeaderChatView
        name={route.params.chatName}
        avatar={route.params.avatar}
        friendId={route.params.friendId}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.white,
    paddingTop: appSize(25),
  },
  inputToolBarContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: appSize(5),
    paddingVertical: appSize(5),
  },
  textInputProps: {
    paddingTop: appSize(8),
    backgroundColor: color.backgroundTextInput,
    borderRadius: appSize(20),
    paddingHorizontal: appSize(10),
    marginRight: appSize(10),
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: appSize(14),
  },
  imageContainer: {
    alignSelf: 'flex-start',
    backgroundColor: color.border,
    borderRadius: appSize(13),
    marginVertical: appSize(2),
    marginHorizontal: appSize(2),
  },
  flexEnd: {
    alignItems: 'flex-end',
  },
  flexStart: {
    alignItems: 'flex-start',
  },
});
