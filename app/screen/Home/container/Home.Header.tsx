import {FlatList, ListRenderItemInfo, StyleSheet, View} from 'react-native';
import React from 'react';
import {AppBlock, AppText, AppTouchableOpacity} from '@starlingtech/element';
import LinearAvatar from 'app/components/LinearAvatar';
import color from '@abong.code/theme/color';
import IconAddImage from 'assets/icons/home/IconAddImage';
import ModalCreatePost from 'app/components/modals/ModalCreatePost';
import {MediaType, useHomeStore} from 'app/store/homeStore';
import DocumentPicker from 'react-native-document-picker';
import useAuthStore from 'app/store/authStore';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {ParamsStack} from 'app/navigation/params';
import {uploadToCloudStorage} from 'helper/uploadToCloudStorage';
import {useDataStore} from 'app/store/dataStore';
import {Resp_User} from 'app/api/auth.type';

type Props = {};

export default function HomeHeader(_props: Props) {
  const dispatchPost = useHomeStore(s => s.dispatchPost);
  const friendList = useDataStore(s => s.recentlyData.friendData);
  const user = useAuthStore(s => s.user);
  const showCreatePost = () => {
    dispatchPost({visible: true});
  };

  const handleSelectFile = async () => {
    const results = await DocumentPicker.pick({
      allowMultiSelection: true,
      type: [DocumentPicker.types.video, DocumentPicker.types.images],
    });
    const media: MediaType[] = results.map(file => {
      return {uri: file.uri, name: file.name || ''};
    });

    media.map(async file => {
      return await uploadToCloudStorage(file);
    });
    if (results) {
      dispatchPost({media, visible: true});
    }
  };

  const renderItem = ({item}: ListRenderItemInfo<Resp_User>) => {
    return <Item item={item} />;
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
            data={friendList}
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

function Item({item}: {item: Resp_User}) {
  const navigation = useNavigation<NativeStackNavigationProp<ParamsStack>>();
  return (
    <LinearAvatar
      uri={item.avatar}
      name={item.lastName}
      onPress={() => navigation.navigate('Profile', {id: item.id})}
    />
  );
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
