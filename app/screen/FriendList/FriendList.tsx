import {appSize} from '@abong.code/config/AppConstant';
import color from '@abong.code/theme/color';
import {useGetFriends} from 'app/api/auth';
import {Resp_User} from 'app/api/auth.type';
import React, {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import ItemFriendList from './container/ItemFriendList';
import {AppBlock, AppText} from '@starlingtech/element';
import AppStyles from 'elements/AppStyles';
import {useRefresh} from 'app/hook/useRefresh';
import {KeyboardAwareFlatList} from 'react-native-keyboard-aware-scroll-view';
import FriendListHeader from './container/FriendList.Header';
import {TopTabScreenProps} from 'app/navigation/params';
import useAuthStore from 'app/store/authStore';
import {useHomeStore} from 'app/store/homeStore';

export default function ({}: TopTabScreenProps<'Tab2'>) {
  const {user} = useAuthStore();
  const sync = useHomeStore(s => s.sync);

  const [search, setSearch] = useState('');

  const {data, refetch} = useGetFriends({
    userId: user.id,
    keyword: search,
    reload: sync.friend,
  });

  const renderItem = ({item}: {item: Resp_User}) => {
    return <ItemFriendList item={item} />;
  };

  const {isRefreshing, onRefresh} = useRefresh(refetch);

  return (
    <View style={styles.container}>
      <FriendListHeader searchText={search} setSearchText={setSearch} />

      <KeyboardAwareFlatList
        refreshing={isRefreshing}
        onRefresh={onRefresh}
        data={data}
        keyExtractor={(_, index) => index.toString()}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={AppStyles.grow}
        ListHeaderComponent={
          data && data.length > 0 ? (
            <AppBlock mt={12}>
              <AppText size={18} weight="700">
                {data.length} Bạn bè
              </AppText>
            </AppBlock>
          ) : null
        }
        ListHeaderComponentStyle={styles.mb10}
        ListEmptyComponent={
          <AppBlock flex center>
            <AppText size={50}>🤷‍♂️</AppText>
            <Text style={styles.titleEmpty}>Không có bạn bè để hiển thị.</Text>
          </AppBlock>
        }
      />
    </View>
  );
}
const styles = StyleSheet.create({
  titleEmpty: {
    textAlign: 'center',
    fontSize: appSize(16),
  },
  mb10: {marginBottom: 10},
  container: {
    flex: 1,
    backgroundColor: color.white,
    paddingHorizontal: 12,
  },
  boxChats: {
    flex: 1,
    paddingHorizontal: appSize(12),
    backgroundColor: color.white,
  },
  titleEmptyFlatlist: {
    textAlign: 'center',
    fontSize: appSize(16),
  },
});
