import {Alert, FlatList, StyleSheet, Text, TextInput, View} from 'react-native';
import React, {useState} from 'react';
import {
  AppBlock,
  AppText,
  AppTouchableOpacity,
  appSize,
} from '@starlingtech/element';
import ReactNativeModal from 'react-native-modal';
import {useGetListUsers} from 'app/api/auth';
import LinearAvatar from 'app/components/LinearAvatar';
import AppStyles from 'elements/AppStyles';
import {chatClient} from 'app/hook/useChatClient';
import {useChatContext} from 'app/components/chat/ChatContext';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import color from '@abong.code/theme/color';
import Ionicons from 'react-native-vector-icons/Ionicons';
import useAuthStore from 'app/store/authStore';
import IconCheckBox from 'assets/icons/IconCheckBox';
import {TextInput as PaperTextInput} from 'react-native-paper';

interface Props {
  isVisible: boolean;
  onClose: () => void;
  navigation: any;
}

export default function ModalAddGroupChat({
  navigation,
  isVisible,
  onClose,
}: Props) {
  const {top, bottom} = useSafeAreaInsets();
  const userId = useAuthStore(s => s.user.id);
  const {setChannel} = useChatContext();

  const {data} = useGetListUsers({userId});

  const [keyword, setKeyword] = useState('');
  const [name, setName] = useState('');
  const [ids, setIds] = useState<string[]>([]);

  const onItemPress = async (id: string) => {
    if (ids.includes(id)) {
      setIds(ids.filter(e => e !== id));
    } else {
      setIds([...ids, id]);
    }
  };

  const onCreate = async () => {
    if (!name) {
      Alert.alert('Vui lòng nhập tên nhóm');
      return;
    }

    if (ids.length < 2) {
      Alert.alert('Nhóm phải có ít nhất 2 người');
      return;
    }

    const channel = chatClient.channel('messaging', {
      members: [userId, ...ids],
      name: name,
    });
    setChannel(channel);
    await channel.watch();
    onClose();
    navigation.navigate('ChannelScreen');
  };

  const filterData = data
    ? data.filter(item => {
        const username = item.firstName + ' ' + item.lastName;
        if (username.toLowerCase().includes(keyword.toLowerCase())) {
          return item;
        }
      })
    : [];
  return (
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
          <Text style={styles.textTitle}>Nhóm mới</Text>

          <AppTouchableOpacity onPress={onCreate}>
            <AppText weight="700" color="primary" mr={12}>
              TẠO
            </AppText>
          </AppTouchableOpacity>
        </AppBlock>

        <AppBlock flex ph={12}>
          <PaperTextInput
            label={'Tên nhóm'}
            mode="outlined"
            contentStyle={{fontSize: appSize(14)}}
            style={{height: appSize(40)}}
            outlineStyle={{borderRadius: appSize(40)}}
            value={name}
            onChangeText={setName}
          />

          <AppBlock row alignItems="center" border={[0, 0, 1]}>
            <AppText style={{color: color.black04}} weight="500" size={20}>
              Đến:
            </AppText>
            <TextInput
              value={keyword}
              onChangeText={setKeyword}
              style={styles.input}
            />
          </AppBlock>

          <FlatList
            data={filterData}
            contentContainerStyle={AppStyles.grow}
            renderItem={({item}) => {
              const isSelected = ids.includes(item.id);
              return (
                <AppBlock
                  mt={12}
                  style={[AppStyles.rowCenterBetween, {width: '100%'}]}>
                  <AppTouchableOpacity
                    style={AppStyles.rowCenter}
                    mt={12}
                    onPress={() => onItemPress(item.id)}>
                    <LinearAvatar uri={item.avatar} size={40} />
                    <AppText size={20}>
                      {item.firstName + ' ' + item.lastName}
                    </AppText>
                  </AppTouchableOpacity>
                  <AppTouchableOpacity onPress={() => onItemPress(item.id)}>
                    <IconCheckBox isChecked={isSelected} />
                  </AppTouchableOpacity>
                </AppBlock>
              );
            }}
          />
        </AppBlock>
      </View>
    </ReactNativeModal>
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
