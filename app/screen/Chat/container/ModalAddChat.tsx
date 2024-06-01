import {FlatList, StyleSheet, Text, TextInput, View} from 'react-native';
import React, {useState} from 'react';
import {
  AppBlock,
  AppText,
  AppTouchableOpacity,
  appSize,
} from '@starlingtech/element';
import ReactNativeModal from 'react-native-modal';
import {getUserById, useGetFriends} from 'app/api/auth';
import LinearAvatar from 'app/components/LinearAvatar';
import AppStyles from 'elements/AppStyles';
import {chatClient} from 'app/hook/useChatClient';
import {useChatContext} from 'app/components/chat/ChatContext';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import color from '@abong.code/theme/color';
import Ionicons from 'react-native-vector-icons/Ionicons';
import useAuthStore from 'app/store/authStore';
import ModalAddGroupChat from './ModalAddGroupChat';

interface Props {
  isVisible: boolean;
  onClose: () => void;
  navigation: any;
}

export default function ModalAddChat({navigation, isVisible, onClose}: Props) {
  const {top, bottom} = useSafeAreaInsets();
  const userId = useAuthStore(s => s.user.id);
  const {setChannel} = useChatContext();

  const [keyword, setKeyword] = useState('');
  const [showAddGroup, setShowAddGroup] = useState(false);

  const {data} = useGetFriends({userId, keyword});

  const onItemPress = async (id: string) => {
    const friend = await getUserById(id);

    const channel = chatClient.channel('messaging', {
      members: [userId, id],
      name: friend.firstName + ' ' + friend.lastName,
    });

    setChannel(channel);
    onClose();
    navigation.navigate('ChannelScreen');
  };

  return (
    <>
      <ReactNativeModal
        animationIn={'slideInRight'}
        animationOut={'slideOutRight'}
        isVisible={isVisible}
        statusBarTranslucent
        hasBackdrop={false}
        useNativeDriver
        style={styles.modal}>
        <View
          style={[styles.container, {paddingBottom: bottom, paddingTop: top}]}>
          <AppBlock mb={12} style={styles.header}>
            <Ionicons
              name="arrow-back-outline"
              size={24}
              onPress={onClose}
              color={color.primary}
            />
            <Text style={styles.textTitle}>Tin nhắn mới</Text>

            <AppTouchableOpacity onPress={() => setShowAddGroup(true)}>
              <AppText weight="700" color="primary">
                Tạo nhóm
              </AppText>
            </AppTouchableOpacity>
          </AppBlock>

          <AppBlock flex ph={12}>
            <AppBlock row alignItems="center" border={[0, 0, 1]}>
              <AppText style={{color: color.black04}} weight="500" size={20}>
                Đến:
              </AppText>
              <TextInput
                style={styles.input}
                value={keyword}
                onChangeText={setKeyword}
              />
            </AppBlock>

            <FlatList
              data={data}
              contentContainerStyle={AppStyles.grow}
              renderItem={({item}) => {
                return (
                  <AppTouchableOpacity
                    style={AppStyles.rowCenter}
                    mt={12}
                    onPress={() => onItemPress(item.id)}>
                    <LinearAvatar uri={item.avatar} size={40} />
                    <AppText size={20}>
                      {item.firstName + ' ' + item.lastName}
                    </AppText>
                  </AppTouchableOpacity>
                );
              }}
            />
          </AppBlock>
        </View>
      </ReactNativeModal>

      <ModalAddGroupChat
        isVisible={showAddGroup}
        onClose={() => setShowAddGroup(false)}
        navigation={navigation}
      />
    </>
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: 'white',
    fontSize: 16,
    flex: 1,
    marginLeft: 8,
  },
  container: {
    flexGrow: 1,
    backgroundColor: color.white,
  },
  modal: {
    flex: 1,
    margin: 0,
  },
  textTitle: {
    flex: 1,
    fontWeight: 'bold',
    fontSize: appSize(20),
    color: color.primary,
    marginLeft: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: color.primary,
  },
});
