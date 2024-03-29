import React, {useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import IconSearch from 'assets/icons/IconSearch';
import Ionicons from 'react-native-vector-icons/Ionicons';
import color from '@abong.code/theme/color';
import {useNavigation} from '@react-navigation/native';
import {appSize} from '@starlingtech/element';
import ModalSearch from 'app/components/modals/ModalSearch';

const FriendRequestHeader = () => {
  const {goBack} = useNavigation();

  const [showModal, setShowModal] = useState(false);

  const onSearchIconPress = () => {
    setShowModal(true);
  };
  return (
    <>
      <View style={styles.header}>
        <TouchableOpacity onPress={goBack}>
          <Ionicons name="chevron-back" size={24} color={color.primary} />
        </TouchableOpacity>
        <Text style={styles.titleHeader}>Lời mời kết bạn</Text>
        <TouchableOpacity onPress={onSearchIconPress}>
          <IconSearch color={color.primary} />
        </TouchableOpacity>
      </View>

      <ModalSearch isVisible={showModal} onClose={() => setShowModal(false)} />
    </>
  );
};

export default FriendRequestHeader;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: appSize(50),
    paddingHorizontal: appSize(12),
  },
  titleHeader: {
    fontSize: appSize(20),
    fontWeight: 'bold',
    color: color.black,
  },
});
