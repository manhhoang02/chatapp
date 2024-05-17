import {
  ImageBackground,
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import React, {useMemo, useState} from 'react';
import {DocumentPickerResponse} from 'react-native-document-picker';
import {size} from 'lodash';
import {AppBlock, AppText} from '@starlingtech/element';
import AppConstant from '@abong.code/config/AppConstant';
import Video from 'react-native-video';
import ModalViewMedia from './modals/ModalViewMedia';

interface Props {
  files: DocumentPickerResponse[];
}

export default function CreatePostMediaField({files}: Props) {
  const [show, setShow] = useState(false);

  const FILES = useMemo(() => {
    const row1 = files.slice(0, 2);
    const row2 = files.slice(2, 5);
    const left = files.slice(5);

    return {row1, row2, left};
  }, [files]);

  const {row1, row2, left} = FILES;
  return (
    <>
      <Pressable onPress={() => setShow(true)}>
        <AppBlock row>
          {row1 &&
            size(row1) > 0 &&
            row1.map((item1, index1) => {
              return (
                <MediaItem key={index1} file={item1} style={styles.row1} />
              );
            })}
        </AppBlock>

        <AppBlock row>
          {row2 &&
            size(row2) > 0 &&
            row2.map((item2, index2) => {
              const isLast = index2 === row2.length - 1 && size(row2) > 2;
              return (
                <MediaItem
                  key={index2}
                  file={item2}
                  style={styles.row2}
                  isLast={isLast}
                  left={left.length}
                />
              );
            })}
        </AppBlock>
      </Pressable>

      <ModalViewMedia isVisible={show} onClose={() => setShow(false)} />
    </>
  );
}

interface ItemProps {
  file: DocumentPickerResponse;
  isLast?: boolean;
  style?: StyleProp<ViewStyle>;
  left?: number;
}
export function MediaItem({file, isLast = false, style, left}: ItemProps) {
  if (file.type === 'image/jpeg' || file.type === 'image/png') {
    return (
      <ImageBackground
        key={file.name + file.uri}
        source={{uri: file.uri}}
        style={style}
        resizeMode="cover">
        {isLast ? (
          <View style={styles.last}>
            <AppText size={30} weight="600" color="white">
              +{left}
            </AppText>
          </View>
        ) : null}
      </ImageBackground>
    );
  } else {
    return (
      <Video
        controls
        source={{
          uri: file.uri,
        }}
        style={style}
        resizeMode={'cover'}
      />
    );
  }
}

const styles = StyleSheet.create({
  last: {
    backgroundColor: '#00000050',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row1: {
    width: '100%',
    flex: 1,
    height: AppConstant.SCREEN_WIDTH / 2,
  },
  row2: {
    width: AppConstant.SCREEN_WIDTH / 3,
    height: AppConstant.SCREEN_WIDTH / 3,
  },
});
