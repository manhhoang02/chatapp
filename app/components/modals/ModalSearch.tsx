import React, {useState} from 'react';
import {appSize} from '@abong.code/config/AppConstant';
import {Text, TextInput, TouchableOpacity} from 'react-native';
import {StyleSheet, View} from 'react-native';
import Modal from 'react-native-modal';
import color from '@abong.code/theme/color';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Resp_User} from 'app/api/auth.type';
import {useGetListUsers} from 'app/api/auth';
import {useNavigation} from '@react-navigation/native';
import {ParamsStack} from 'app/navigation/params';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {AppBlock, AppText} from '@starlingtech/element';
import light from 'starling/theme/color/light';
import LinearAvatar from '../LinearAvatar';
import {useRefresh} from 'app/hook/useRefresh';
import {KeyboardAwareFlatList} from 'react-native-keyboard-aware-scroll-view';
import useAuthStore from 'app/store/authStore';

type Props = {
  isVisible: boolean;
  onClose: () => void;
};

export default function ({isVisible, onClose}: Props) {
  const {top} = useSafeAreaInsets();
  const user = useAuthStore(s => s.user);
  const navigation = useNavigation<NativeStackNavigationProp<ParamsStack>>();

  const [search, setSearch] = useState('');

  const {data, refetch} = useGetListUsers({
    keyword: search,
    userId: user.id,
  });

  const renderItem = ({item}: {item: Resp_User}) => {
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => {
          onClose();
          navigation.navigate('Profile', {id: item.id});
        }}>
        <LinearAvatar uri={item.avatar} size={60} disabled />
        <AppBlock>
          <Text style={styles.nameChat}>
            {item.firstName + ' ' + item.lastName}
          </Text>
          <Text style={{color: color.black04}}>{item.email}</Text>
        </AppBlock>
      </TouchableOpacity>
    );
  };

  const ListEmptyComponent = (
    <AppBlock flex center>
      <AppText size={50}>🤷‍♂️</AppText>
      <Text style={styles.titleEmptyFlatlist}>Không tìm thấy kết quả.</Text>
    </AppBlock>
  );

  const {onRefresh, isRefreshing} = useRefresh(refetch);
  return (
    <Modal
      animationIn={'slideInRight'}
      animationOut={'slideOutRight'}
      isVisible={isVisible}
      hideModalContentWhileAnimating
      statusBarTranslucent
      useNativeDriver
      style={styles.modal}
      onBackdropPress={onClose}>
      <AppBlock style={[styles.container, {paddingTop: top}]}>
        <View style={styles.header}>
          <Ionicons
            name="arrow-back-outline"
            size={24}
            onPress={onClose}
            color={color.black}
          />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Tìm kiếm bạn bè"
            placeholderTextColor={light.black_70}
            style={styles.input}
          />
        </View>

        <KeyboardAwareFlatList
          refreshing={isRefreshing}
          onRefresh={onRefresh}
          data={data}
          keyExtractor={(_, index) => index.toString()}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
          ListEmptyComponent={ListEmptyComponent}
        />
      </AppBlock>
    </Modal>
  );
}

const styles = StyleSheet.create({
  list: {padding: 12, flexGrow: 1},
  header: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: color.primary,
    flexDirection: 'row',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: color.white,
  },
  modal: {
    flex: 1,
    margin: 0,
  },
  input: {
    flex: 1,
    height: 40,
    backgroundColor: light.light_gray,
    width: '100%',
    borderRadius: 20,
    paddingHorizontal: 12,
    marginLeft: 12,
  },
  titleEmptyFlatlist: {
    textAlign: 'center',
    fontSize: appSize(16),
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: appSize(12),
  },
  nameChat: {
    fontSize: appSize(16),
    fontWeight: 'bold',
    marginBottom: appSize(2),
    color: color.black,
  },
});
