import {Alert, FlatList, StyleSheet} from 'react-native';
import React, {useState} from 'react';
import {AppBlock, AppText, AppTouchableOpacity} from '@starlingtech/element';
import ReactNativeModal from 'react-native-modal';
import {TextInput} from 'react-native-paper';
import {useGetListUsers} from 'app/api/auth';
import LinearAvatar from 'app/components/LinearAvatar';
import IconCheckBox from 'assets/icons/IconCheckBox';
import AppStyles from 'elements/AppStyles';
import {useCreateChat} from 'app/api/chat';
import {
  showToastMessageError,
  showToastMessageSuccess,
} from '@abong.code/helpers/messageHelper';
import {useHomeStore} from 'app/store/homeStore';
import moment from 'moment';

interface Props {
  isVisible: boolean;
  onClose: () => void;
}

export default function ModalAddChat({isVisible, onClose}: Props) {
  const dispatch = useHomeStore(s => s.dispatchSync);

  const {data} = useGetListUsers({userId: ''});
  const {mutate} = useCreateChat();

  const [name, setName] = useState('');
  const [ids, setIds] = useState<string[]>([]);

  const onCreateChat = () => {
    if (!name) {
      Alert.alert('Vui lòng nhập tên đoạn chat');
      return;
    }

    if (ids.length < 2) {
      Alert.alert('Vui lòng chọn ít nhất 2 thành viên');
      return;
    }
    mutate(
      {name, members: ids},
      {
        onSuccess: () => {
          showToastMessageSuccess('Tạo đoạn chat thành công');
          dispatch({chat: moment().unix()});
          onClose();
        },
        onError: () => {
          showToastMessageError('Tạo đoạn chat thất bại');
        },
      },
    );
  };

  const onItemPress = (id: string) => {
    if (ids.includes(id)) {
      setIds(ids.filter(e => e !== id));
    } else {
      setIds([...ids, id]);
    }
  };
  return (
    <ReactNativeModal
      animationIn={'fadeIn'}
      animationOut={'fadeOut'}
      isVisible={isVisible}
      statusBarTranslucent
      useNativeDriver
      onBackdropPress={onClose}
      style={styles.modal}>
      <AppBlock
        background="white"
        style={{
          width: '95%',
          height: 500,
          paddingVertical: 10,
          paddingHorizontal: 12,
        }}>
        <AppText size={30} color="primary" mb={10}>
          Tạo đoạn chat
        </AppText>

        <TextInput
          mode="outlined"
          label={'Tên đoạn chat'}
          value={name}
          onChangeText={setName}
        />

        <AppText size={20} mt={16}>
          Thêm thành viên
        </AppText>

        <FlatList
          data={data}
          contentContainerStyle={{flexGrow: 1, alignItems: 'flex-start'}}
          renderItem={({item}) => {
            const isSelected = ids.includes(item.id);
            return (
              <AppBlock
                mt={12}
                style={[AppStyles.rowCenterBetween, {width: '100%'}]}>
                <AppBlock row center>
                  <LinearAvatar uri={item.avatar} size={40} />
                  <AppText size={20}>
                    {item.firstName + ' ' + item.lastName}
                  </AppText>
                </AppBlock>
                <AppTouchableOpacity onPress={() => onItemPress(item.id)}>
                  <IconCheckBox isChecked={isSelected} />
                </AppTouchableOpacity>
              </AppBlock>
            );
          }}
        />

        <AppBlock justifyContent="flex-end" row>
          <AppTouchableOpacity onPress={onClose}>
            <AppText size={22} color="text">
              Hủy
            </AppText>
          </AppTouchableOpacity>
          <AppTouchableOpacity ml={12} onPress={onCreateChat}>
            <AppText size={22} color="primary">
              Tạo
            </AppText>
          </AppTouchableOpacity>
        </AppBlock>
      </AppBlock>
    </ReactNativeModal>
  );
}

const styles = StyleSheet.create({
  modal: {flex: 1, margin: 0, alignItems: 'center'},
});
