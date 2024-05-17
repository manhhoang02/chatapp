import React from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {appSize} from '@abong.code/config/AppConstant';
import color from '@abong.code/theme/color';
import {useGetFriendRequests} from 'app/api/auth';
import {Resp_User} from 'app/api/auth.type';
import ItemFriendRequest from './container/ItemFriendRequest';
import {AppBlock, AppText} from '@starlingtech/element';
import {useRefresh} from 'app/hook/useRefresh';
import FriendRequestHeader from './container/FriendRequest.Header';
import useAuthStore from 'app/store/authStore';
import {useHomeStore} from 'app/store/homeStore';

export default function () {
  const {top, bottom} = useSafeAreaInsets();
  const {user} = useAuthStore();
  const sync = useHomeStore(s => s.sync);

  const {data, refetch} = useGetFriendRequests({
    userId: user.id,
    reload: sync.friend,
  });

  const renderItem = ({item}: {item: Resp_User}) => {
    return <ItemFriendRequest item={item} />;
  };

  const {isRefreshing, onRefresh} = useRefresh(refetch);

  return (
    <View style={[styles.container, {paddingTop: top, paddingBottom: bottom}]}>
      <FriendRequestHeader />
      <FlatList
        refreshing={isRefreshing}
        onRefresh={onRefresh}
        data={data}
        keyExtractor={(_, index) => index.toString()}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        ListHeaderComponent={
          <AppBlock mt={12}>
            <AppText size={18} weight="700">
              Lời mời kết bạn{' '}
              <AppText size={18} color="red" weight="700">
                {data?.length}
              </AppText>
            </AppText>
          </AppBlock>
        }
        ListHeaderComponentStyle={styles.mb10}
        ListEmptyComponent={
          <AppBlock flex center>
            <AppText size={50}>🤷‍♂️</AppText>
            <Text style={styles.titleEmptyFlatlist}>
              Không có lời mời kết bạn nào.
            </Text>
          </AppBlock>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  mb10: {marginBottom: 10},
  container: {
    flex: 1,
    backgroundColor: color.white,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: appSize(12),
  },
  titleEmptyFlatlist: {
    textAlign: 'center',
    fontSize: appSize(16),
  },
});
