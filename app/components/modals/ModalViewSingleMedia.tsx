import {StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';
import ReactNativeModal from 'react-native-modal';
import {AppBlock, appSize} from '@starlingtech/element';
import {MediaItem} from '../CreatePostMediaField';
import {MediaType} from 'app/store/homeStore';
import AppConstant from '@abong.code/config/AppConstant';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface Props {
  isVisible: boolean;
  onClose: () => void;
  file: MediaType;
}

const WIDTH = AppConstant.SCREEN_WIDTH;

export default function (props: Props) {
  if (!props.file.uri) {
    return null;
  }
  return (
    <ReactNativeModal
      isVisible={props.isVisible}
      useNativeDriver
      statusBarTranslucent
      onBackdropPress={props.onClose}
      onBackButtonPress={props.onClose}
      style={styles.modal}>
      <AppBlock background="white" flex>
        <TouchableOpacity onPress={props.onClose}>
          <Ionicons name="close" size={30} style={styles.icon} />
        </TouchableOpacity>
        <MediaItem file={props.file} style={styles.media} />
      </AppBlock>
    </ReactNativeModal>
  );
}

const styles = StyleSheet.create({
  icon: {padding: appSize(8)},
  media: {width: WIDTH, flex: 1},
  modal: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
