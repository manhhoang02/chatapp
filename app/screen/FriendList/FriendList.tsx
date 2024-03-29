import AppConstant, {appSize} from '@abong.code/config/AppConstant';
import {useAppContext} from '@abong.code/context/AppProvider';
import color from '@abong.code/theme/color';
import {getProfileMe, useGetFriendList} from 'app/api/auth';
import {Friend} from 'app/api/auth.type';
import moment from 'moment';
import React, {useEffect, useRef, useState} from 'react';
import {Text} from 'react-native';
import {StyleSheet, View} from 'react-native';
import {ActivityIndicator} from 'react-native-paper';
import ItemFriendList from './container/ItemFriendList';
import {AppBlock, AppText} from '@starlingtech/element';
import AppStyles from 'elements/AppStyles';
import {useRefresh} from 'app/hook/useRefresh';
import {KeyboardAwareFlatList} from 'react-native-keyboard-aware-scroll-view';
import FriendListHeader from './container/FriendList.Header';
import {TopTabScreenProps} from 'app/navigation/params';

let page = 1;

export default function ({navigation}: TopTabScreenProps<'Tab2'>) {
  const {user, setUser, syncData, socket} = useAppContext();

  const currentList = useRef<Friend[]>([]);
  const hasNextPage = useRef(false);
  const refOnEndReachedCalled = useRef(true);

  const [friends, setFriends] = useState<Friend[]>([]);
  const [search, setSearch] = useState('');
  const [reload, setReload] = useState(0);

  const {data, isSuccess, isError, refetch} = useGetFriendList(
    search,
    page,
    AppConstant.LIST_SIZE,
    reload,
  );

  const renderItem = ({item}: {item: Friend}) => {
    return <ItemFriendList item={item} />;
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
      setFriends(currentList.current);
      hasNextPage.current = data.users.length > AppConstant.LIST_SIZE;
    } else if (isError) {
      hasNextPage.current = false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, data, isSuccess, isError]);

  useEffect(() => {
    socket.on('change-relationship', () => {
      getProfileMe().then(res => {
        setUser({...user, ...res});
      });
      setReload(moment().unix());
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket]);
  useEffect(() => {
    setReload(moment().unix());
  }, [syncData.friends]);

  const {isRefreshing, onRefresh} = useRefresh(refetch);

  return (
    <View style={styles.container}>
      <FriendListHeader
        searchText={search}
        setSearchText={setSearch}
        onAddIcon={() => navigation.navigate('FriendRequests')}
      />

      <KeyboardAwareFlatList
        refreshing={isRefreshing}
        onRefresh={onRefreshing}
        data={friends}
        keyExtractor={(_, index) => index.toString()}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={AppStyles.grow}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.1}
        ListHeaderComponent={
          friends.length > 0 ? (
            <AppBlock mt={12}>
              <AppText size={18} weight="700">
                {friends.length} Bạn bè
              </AppText>
            </AppBlock>
          ) : null
        }
        ListHeaderComponentStyle={styles.mb10}
        ListEmptyComponent={
          <AppBlock flex center>
            <AppText size={50}>🤷‍♂️</AppText>
            <Text style={styles.titleEmptyFlatlist}>
              Không có bạn bè để hiển thị.
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
        enableResetScrollToCoords={false}
      />
    </View>
  );
}
const styles = StyleSheet.create({
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
