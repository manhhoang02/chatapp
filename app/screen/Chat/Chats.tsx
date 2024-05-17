import {appSize} from '@abong.code/config/AppConstant';
import {useAppContext} from '@abong.code/context/AppProvider';
import {consoleLog} from '@abong.code/helpers/logHelper';
import color from '@abong.code/theme/color';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {AppBlock, AppText, AppTouchableOpacity} from '@starlingtech/element';
import {getAllChats, useGetChats} from 'app/api/chat';
import {ChatProps} from 'app/api/chat.type';
import LinearAvatar from 'app/components/LinearAvatar';
import {ParamsStack} from 'app/navigation/params';
import AppStyles from 'elements/AppStyles';
import React, {useEffect, useState} from 'react';
import {FlatList, TouchableOpacity} from 'react-native';
import {StyleSheet, Text, View} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ModalAddChat from './container/ModalAddChat';
import useAuthStore from 'app/store/authStore';
import ChatItem from './container/Chat.Item';

export default function () {
  const {user} = useAuthStore();
  const [chats, setChats] = useState<ChatProps[]>([]);
  const navigation = useNavigation<NativeStackNavigationProp<ParamsStack>>();
  const [showAddChat, setShowAddChat] = useState(false);

  const {data} = useGetChats({userId: user.id});

  const renderItem = ({item}: {item: ChatProps}) => <ChatItem item={item} />;

  return (
    <>
      <View style={styles.container}>
        <AppBlock style={AppStyles.rowCenterBetween}>
          <Text style={styles.title}>Tin nhắn</Text>
          <AppTouchableOpacity mr={12} onPress={() => setShowAddChat(true)}>
            <Ionicons name="add-outline" color={color.primary} size={28} />
          </AppTouchableOpacity>
        </AppBlock>
        <FlatList
          data={data}
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

      <ModalAddChat
        isVisible={showAddChat}
        onClose={() => setShowAddChat(false)}
      />
    </>
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
