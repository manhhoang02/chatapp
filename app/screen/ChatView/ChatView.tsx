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
import useAuthStore from 'app/store/authStore';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

export default function ({
  route,
}: NativeStackScreenProps<ParamsStack, 'ChatView'>) {
  const {user} = useAuthStore();
  const {top} = useSafeAreaInsets();

  const [messages, setMessages] = useState<IMessage[]>([]);
  const [message, setMessage] = useState('');

  const onSend = () => {
    const params = new FormData();
    params.append('chatId', user.id);
    params.append('senderId', user.id);
    params.append('text', message);
    sendMessage(params).then(res => {
      setMessage('');
      const cloneMessages = [...messages];
      cloneMessages.unshift({
        _id: res._id,
        text: res.text,
        createdAt: new Date(res.createdAt),
        user: {
          _id: user.id,
        },
      });
      setMessages(cloneMessages);
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
      params.append('senderId', user.id);

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
            _id: user.id,
            avatar: user.avatar,
          },
        });
        setMessages(cloneMessages);
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
        // currentMessage: {...props.currentMessage, image: item},
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
            props.currentMessage?.user._id !== user.id
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

  return (
    <View style={[styles.container, {paddingTop: top}]}>
      <HeaderChatView
        name={'Hoang Manh'}
        avatar={user.avatar}
        friendId={'abc'}
      />
      <View style={styles.container}>
        <GiftedChat
          messages={messages}
          user={{
            _id: user.id,
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
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.white,
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
