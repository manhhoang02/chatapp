import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import ReactNativeModal from 'react-native-modal';
import color from '@abong.code/theme/color';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {AppBlock, appSize} from '@starlingtech/element';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {MediaItem} from '../CreatePostMediaField';
import AppConstant from '@abong.code/config/AppConstant';
import AppStyles from 'elements/AppStyles';
import {MediaType, useHomeStore} from 'app/store/homeStore';

type Props = {
  isVisible: boolean;
  onClose: () => void;
  data?: MediaType[];
};
export default function ({isVisible, onClose, data}: Props) {
  const {top, bottom} = useSafeAreaInsets();

  const media = useHomeStore(s => s.post.media);

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
        style={[
          styles.container,
          {
            paddingBottom: bottom,
            paddingTop: top,
          },
        ]}>
        <AppBlock mb={12} style={styles.header}>
          <Ionicons
            name="arrow-back-outline"
            size={24}
            onPress={onClose}
            color={color.primary}
          />
          {!data && (
            <>
              <Text style={styles.textTitle}>Chỉnh sửa</Text>
              <TouchableOpacity onPress={onClose}>
                <Text style={styles.doneText}>Xong</Text>
              </TouchableOpacity>
            </>
          )}
        </AppBlock>

        <FlatList
          data={data ?? media}
          renderItem={({item}) => (
            <AppBlock key={item.name + item.uri}>
              <MediaItem file={item} style={styles.media} />
              {!data && (
                <Ionicons
                  name="close"
                  size={30}
                  color={color.btnTwitter}
                  style={styles.icon}
                />
              )}
            </AppBlock>
          )}
          keyExtractor={(_, index) => index.toString()}
          contentContainerStyle={AppStyles.grow}
        />
      </View>
    </ReactNativeModal>
  );
}

const styles = StyleSheet.create({
  media: {
    width: AppConstant.SCREEN_WIDTH,
    height: 300,
    marginBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  icon: {position: 'absolute', right: 8, top: 0},
  doneText: {
    fontSize: 18,
    color: color.primary,
    fontWeight: '600',
    marginRight: 8,
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
  container: {
    flexGrow: 1,
    backgroundColor: color.white,
  },
  modal: {
    flex: 1,
    margin: 0,
  },
});
