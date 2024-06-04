import {FlatList, Linking, StyleSheet} from 'react-native';
import React from 'react';
import {
  AppBlock,
  AppText,
  AppTouchableOpacity,
  appSize,
} from '@starlingtech/element';
import {useChatContext} from 'app/components/chat/ChatContext';
import IconPDF from 'assets/icons/IconPDF';
import IconDoc from 'assets/icons/IconDoc';
import AppStyles from 'elements/AppStyles';
import color from '@abong.code/theme/color';

export default function () {
  const {channel} = useChatContext();

  const renderItem = ({item}: {item: any}) => {
    return (
      <AppTouchableOpacity
        style={styles.item}
        onPress={() => openURL(item.asset_url)}>
        {item.title.includes('pdf') ? (
          <IconPDF width={30} />
        ) : (
          <IconDoc width={30} />
        )}

        <AppBlock ml={12} flex>
          <AppText weight="700">{item.title}</AppText>
          <AppText size={12} mt={2} color={color.disabled}>
            {calculateFileSize(item.file_size)}
          </AppText>
        </AppBlock>
      </AppTouchableOpacity>
    );
  };

  const openURL = (url: string) => {
    Linking.openURL(url);
  };

  const media = channel.state.messageSets[0].messages.flatMap(
    (item: any) => item.attachments,
  );

  const newData = media.filter((item: any) => item.type === 'file');

  return (
    <FlatList
      data={newData}
      renderItem={renderItem}
      keyExtractor={(item, index) => item.name + index.toString()}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[AppStyles.grow, styles.list]}
    />
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    borderRadius: 8,
    marginBottom: 8,
    paddingVertical: 12,
    paddingHorizontal: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: color.border,
  },
  list: {marginTop: appSize(12), paddingHorizontal: appSize(12)},
});

function calculateFileSize(size: number) {
  if (size <= 0) {
    return '0 MB';
  }

  const result = Math.round(size / (1024 * 1024) - 1);
  return `${result} MB`;
}
