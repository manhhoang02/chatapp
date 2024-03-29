import React, {useEffect, useRef, useState} from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import AppConstant, {appSize} from '@abong.code/config/AppConstant';
import color from '@abong.code/theme/color';
import {useGetFriendRequests} from 'app/api/auth';
import {Friend} from 'app/api/auth.type';
import {ActivityIndicator} from 'react-native-paper';
import ItemFriendRequest from './container/ItemFriendRequest';
import {AppBlock, AppText} from '@starlingtech/element';
import {friendsData} from 'app/data/friends';
import {useRefresh} from 'app/hook/useRefresh';
import FriendRequestHeader from './container/FriendRequest.Header';

let page = 1;

export default function () {
  const {top, bottom} = useSafeAreaInsets();

  const currentList = useRef<Friend[]>([]);
  const hasNextPage = useRef(false);
  const refOnEndReachedCalled = useRef(true);

  const [resData, setResData] = useState<Friend[]>([]);
  const [reload, setReload] = useState(0);

  const {data, isSuccess, isError, refetch} = useGetFriendRequests(
    page,
    AppConstant.LIST_SIZE,
    reload,
  );

  const renderItem = ({item}: {item: Friend}) => {
    return <ItemFriendRequest item={item} setReload={setReload} />;
  };

  const onRefreshing = () => {
    onRefresh();
    page = 1;
  };

  const onEndReached = () => {
    if (!refOnEndReachedCalled.current) {
      if (hasNextPage.current) {
        page++;
        hasNextPage.current = false;
      }
      refOnEndReachedCalled.current = true;
    }
  };

  useEffect(() => {
    if (isSuccess && data) {
      if (page === 1) {
        currentList.current = data.users;
      } else {
        currentList.current = [...currentList.current, ...data.users];
      }
      setResData(currentList.current);
      hasNextPage.current = data.users.length > AppConstant.LIST_SIZE;
    } else if (isError) {
      hasNextPage.current = false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, data, isSuccess, isError]);

  const {isRefreshing, onRefresh} = useRefresh(refetch);

  return (
    <View style={[styles.container, {paddingTop: top, paddingBottom: bottom}]}>
      <FriendRequestHeader />
      <FlatList
        refreshing={isRefreshing}
        onRefresh={onRefreshing}
        data={friendsData}
        keyExtractor={(_, index) => index.toString()}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.1}
        contentContainerStyle={styles.content}
        ListHeaderComponent={
          <AppBlock mt={12}>
            <AppText size={18} weight="700">
              Lời mời kết bạn{' '}
              <AppText size={18} color="red" weight="700">
                {resData.length}
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
        ListFooterComponent={
          hasNextPage.current ? (
            <ActivityIndicator color={color.primary} />
          ) : null
        }
        onMomentumScrollBegin={() => {
          refOnEndReachedCalled.current = false;
        }}
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
