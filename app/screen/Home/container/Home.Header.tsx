import {FlatList, ListRenderItemInfo, StyleSheet, View} from 'react-native';
import React from 'react';
import {AppBlock, AppText, AppTouchableOpacity} from '@starlingtech/element';
import LinearAvatar from 'app/components/LinearAvatar';
import color from '@abong.code/theme/color';
import IconAddImage from 'assets/icons/home/IconAddImage';
import ModalCreatePost from 'app/components/modals/ModalCreatePost';
import {useHomeStore} from 'app/store/homeStore';
import DocumentPicker from 'react-native-document-picker';
import useAuthStore from 'app/store/authStore';
import {useGetUserById} from 'app/api/auth';

type Props = {};

export default function HomeHeader(_props: Props) {
  const dispatchPost = useHomeStore(s => s.dispatchPost);
  const user = useAuthStore(s => s.user);
  const showCreatePost = () => {
    dispatchPost({visible: true});
  };

  const handleSelectFile = async () => {
    const results = await DocumentPicker.pickMultiple({
      allowMultiSelection: true,
      type: [DocumentPicker.types.video, DocumentPicker.types.images],
    });
    if (results) {
      dispatchPost({media: results, visible: true});
    }
  };

  const renderItem = ({item}: ListRenderItemInfo<string>) => {
    return <Item id={item} />;
  };
  return (
    <>
      <View>
        <AppBlock
          padding={12}
          row
          background="white"
          alignItems="center"
          style={styles.actionField}>
          <AppTouchableOpacity activeOpacity={0.8} overflow="hidden">
            <LinearAvatar uri={user.avatar} size={40} style={styles.mr0} />
          </AppTouchableOpacity>

          <AppTouchableOpacity
            activeOpacity={0.8}
            style={styles.questionBtn}
            onPress={showCreatePost}>
            <AppText>Bạn đang nghĩ gì?</AppText>
          </AppTouchableOpacity>

          <AppTouchableOpacity onPress={handleSelectFile}>
            <IconAddImage />
          </AppTouchableOpacity>
        </AppBlock>

        <AppBlock mt={6} padding={[12, 0, 12, 12]} background="white">
          <FlatList
            horizontal
            data={user.friends}
            showsHorizontalScrollIndicator={false}
            ListHeaderComponent={
              <LinearAvatar
                uri={user.avatar}
                name={'Bạn'}
                add
                onPress={showCreatePost}
              />
            }
            renderItem={renderItem}
          />
        </AppBlock>
      </View>

      <ModalCreatePost />
    </>
  );
}

function Item({id}: {id: string}) {
  const {data: friend} = useGetUserById(id);
  return <LinearAvatar uri={friend?.avatar} name={friend?.lastName} />;
}

const styles = StyleSheet.create({
  mr0: {marginRight: 0},
  actionField: {
    borderColor: color.primary,
    borderBottomWidth: 1,
    borderBottomRightRadius: 5,
    borderBottomLeftRadius: 8,
  },
  questionBtn: {
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    borderWidth: 1,
    flex: 1,
    paddingLeft: 17,
    marginLeft: 12,
    marginRight: 16,
    borderColor: color.primary,
  },
});
