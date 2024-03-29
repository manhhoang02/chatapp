import {FlatList, Image, StyleSheet, View} from 'react-native';
import React, {useState} from 'react';
import {AppBlock, AppText, AppTouchableOpacity} from '@starlingtech/element';
import LinearAvatar from 'app/components/LinearAvatar';
import {useAppContext} from '@abong.code/context/AppProvider';
import color from '@abong.code/theme/color';
import IconAddImage from 'assets/icons/home/IconAddImage';
import ModalCreatePost from 'app/components/modals/ModalCreatePost';

const friends = ['Edein', 'Sumei', 'Dicak', 'Vileni', 'Kirina', 'Maico'];

type Props = {};

export default function HomeHeader(_props: Props) {
  const {user} = useAppContext();

  const [showCreatePost, setShowCreatePost] = useState(false);
  const toggleCreatePost = () => {
    setShowCreatePost(!showCreatePost);
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
            <Image
              source={
                user.avatar
                  ? {uri: user.avatar}
                  : require('assets/image/profile.png')
              }
              style={styles.avatar}
              resizeMode="cover"
            />
          </AppTouchableOpacity>

          <AppTouchableOpacity
            activeOpacity={0.8}
            style={styles.questionBtn}
            onPress={toggleCreatePost}>
            <AppText>Bạn đang nghĩ gì?</AppText>
          </AppTouchableOpacity>

          <AppTouchableOpacity>
            <IconAddImage />
          </AppTouchableOpacity>
        </AppBlock>

        <AppBlock mt={6} padding={[12, 0, 12, 12]} background="white">
          <FlatList
            horizontal
            data={friends}
            showsHorizontalScrollIndicator={false}
            ListHeaderComponent={
              <LinearAvatar
                uri={user.avatar}
                name={'Bạn'}
                add
                onPress={toggleCreatePost}
              />
            }
            renderItem={({item}) => (
              <LinearAvatar uri={user.avatar} name={item} />
            )}
          />
        </AppBlock>
      </View>

      <ModalCreatePost isVisible={showCreatePost} onClose={toggleCreatePost} />
    </>
  );
}

const styles = StyleSheet.create({
  avatar: {width: 40, height: 40, borderRadius: 20},
  actionField: {
    borderColor: color.primary,
    borderBottomWidth: 1,
    borderBottomRightRadius: 8,
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
