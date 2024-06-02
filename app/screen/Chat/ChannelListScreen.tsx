import {AppBlock, AppTouchableOpacity} from '@starlingtech/element';
import {useChatContext} from 'app/components/chat/ChatContext';
import {TopTabScreenProps} from 'app/navigation/params';
import useAuthStore from 'app/store/authStore';
import React, {useState} from 'react';
import {ChannelList} from 'stream-chat-react-native'; // Or stream-chat-expo
import ModalAddChat from './container/ModalAddChat';
import AppStyles from 'elements/AppStyles';
import {StyleSheet, Text} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import color from '@abong.code/theme/color';
import LinearAvatar from 'app/components/LinearAvatar';
import {getStreamAvatar} from 'app/hook/useGetAvatar';

export const ChannelListScreen = ({navigation}: TopTabScreenProps<'Tab4'>) => {
  const userId = useAuthStore(s => s.user.id);

  const {setChannel} = useChatContext();
  const [showAddChat, setShowAddChat] = useState(false);

  const filters = {
    members: {
      $in: [userId],
    },
  };

  const onSelect = (channel: any) => {
    setChannel(channel);
    navigation.navigate('ChannelScreen');
  };

  const renderPreviewAvatar = ({channel}: {channel: any}) => {
    const {avatar} = getStreamAvatar(channel);

    return <LinearAvatar uri={avatar} size={45} disabled />;
  };

  return (
    <>
      <AppBlock flex background="white" ph={12}>
        <AppBlock style={AppStyles.rowCenterBetween}>
          <Text style={styles.title}>Tin nhắn</Text>
          <AppTouchableOpacity mr={12} onPress={() => setShowAddChat(true)}>
            <Ionicons name="add" color={color.primary} size={28} />
          </AppTouchableOpacity>
        </AppBlock>
        <ChannelList
          filters={filters}
          sort={{
            last_message_at: -1,
          }}
          onSelect={onSelect}
          PreviewAvatar={renderPreviewAvatar}
        />
      </AppBlock>

      <ModalAddChat
        navigation={navigation}
        isVisible={showAddChat}
        onClose={() => setShowAddChat(false)}
      />
    </>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: color.primary,
    marginVertical: 10,
  },
});
