import {FlatList, Pressable, StyleSheet} from 'react-native';
import React, {useState} from 'react';
import {appSize} from '@starlingtech/element';
import {useChatContext} from 'app/components/chat/ChatContext';
import AppStyles from 'elements/AppStyles';
import {MediaItem} from 'app/components/CreatePostMediaField';
import AppConstant from '@abong.code/config/AppConstant';
import color from '@abong.code/theme/color';
import {MediaType} from 'app/store/homeStore';
import ModalViewSingleMedia from '../../ModalViewSingleMedia';

const SIZE = AppConstant.SCREEN_WIDTH / 3;

export default function () {
  const {channel} = useChatContext();

  const [showMedia, setShowMedia] = useState(false);
  const [file, setFile] = useState<MediaType>({
    name: '',
    uri: '',
  });

  const show = (value: MediaType) => {
    setFile(value);
    setShowMedia(true);
  };
  const hide = () => setShowMedia(false);

  const renderItem = ({item}: {item: MediaType}) => {
    return (
      <Pressable onPress={() => show(item)}>
        <MediaItem file={item} style={styles.media} controls={false} />
      </Pressable>
    );
  };

  const media = channel.state.messageSets[0].messages.flatMap(
    (item: any) => item.attachments,
  );

  const newData: MediaType[] = media.reduce((acc: MediaType[], item: any) => {
    if (item.type === 'image' || item.type === 'video') {
      acc.push({
        uri: item.type === 'image' ? item.image_url : item.asset_url,
        name: item.type === 'image' ? item.fallback : item.title,
      });
    }
    return acc;
  }, []);

  return (
    <>
      <FlatList
        data={newData}
        renderItem={renderItem}
        keyExtractor={(item, index) => item.name + index.toString()}
        showsVerticalScrollIndicator={false}
        numColumns={3}
        key={3}
        contentContainerStyle={[AppStyles.grow, {marginTop: appSize(12)}]}
      />

      <ModalViewSingleMedia isVisible={showMedia} onClose={hide} file={file} />
    </>
  );
}

const styles = StyleSheet.create({
  media: {
    width: SIZE,
    height: SIZE,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: color.border,
    marginBottom: 2,
  },
});
