import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useRef, useState} from 'react';
import {FlatList, StyleSheet, Text} from 'react-native';
import {View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import AppConstant, {appSize} from '@abong.code/config/AppConstant';
import color from '@abong.code/theme/color';
import {TouchableOpacity} from 'react-native';
import {useGetFriendRequests} from 'app/api/auth';
import {Friend} from 'app/api/auth.type';
import {ActivityIndicator} from 'react-native-paper';
import ItemFriendRequest from './container/ItemFriendRequest';
import ModalSearch from 'app/components/modals/ModalSearch';
import Foundation from 'react-native-vector-icons/Foundation';
import {useAppContext} from '@abong.code/context/AppProvider';
import moment from 'moment';

export default function () {
  const {dispatchSyncData, syncData} = useAppContext();
  const navigation = useNavigation();
  const {top, bottom} = useSafeAreaInsets();
  const noLoadMore = useRef(false);
  const prevData = useRef<Friend[]>([]);
  const refreshing = useRef<boolean>(false);
  const scrollBegin = useRef(false);

  const [resData, setResData] = useState<Friend[]>([]);
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [reload, setReload] = useState(0);

  const {data, isSuccess, isError, isFetchedAfterMount} = useGetFriendRequests(
    page,
    AppConstant.LIST_SIZE,
    reload,
  );

  const renderItem = ({item}: {item: Friend}) => {
    return <ItemFriendRequest item={item} setReload={setReload} />;
  };

  const ListEmptyComponent = isFetchedAfterMount ? (
    <View style={styles.contentEmpty}>
      <Foundation name="page-search" size={100} />
      <Text style={styles.titleEmptyFlatlist}>
        Không có lời mời kết bạn nào.
      </Text>
    </View>
  ) : null;

  if (isFetchedAfterMount) {
    refreshing.current = false;
  }
  const onRefresh = () => {
    refreshing.current = true;
    setPage(1);
  };

  const onEndReached = () => {
    if (scrollBegin.current) {
      if (noLoadMore.current === false) {
        setPage(prev => prev + 1);
      }
      scrollBegin.current = false;
    }
  };

  useEffect(() => {
    if (isSuccess && data && data.users) {
      refreshing.current = false;
      if (page === 1) {
        prevData.current = data.users || [];
      } else {
        prevData.current = [...prevData.current, ...data.users];
      }
      setResData(prevData.current);
      noLoadMore.current = data.users.length < AppConstant.LIST_SIZE;
    } else if (isError) {
      noLoadMore.current = true;
    }
  }, [page, data, isSuccess, isError]);

  return (
    <View style={[styles.container, {paddingTop: top, paddingBottom: bottom}]}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
            dispatchSyncData({...syncData, friends: moment().unix()});
          }}>
          <Ionicons name="chevron-back" size={24} color={color.black} />
        </TouchableOpacity>
        <Text style={styles.titleHeader}>Lời mời kết bạn</Text>
        <TouchableOpacity
          onPress={() => {
            setShowModal(true);
          }}>
          <Feather name="search" size={24} color={color.black} />
        </TouchableOpacity>
      </View>
      <View style={styles.content}>
        <FlatList
          refreshing={refreshing.current}
          onRefresh={onRefresh}
          data={resData}
          keyExtractor={(_, index) => index.toString()}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          onEndReached={onEndReached}
          onEndReachedThreshold={0.1}
          ListEmptyComponent={ListEmptyComponent}
          ListFooterComponent={
            noLoadMore.current ? null : (
              <ActivityIndicator color={color.primary} />
            )
          }
          onMomentumScrollBegin={() => {
            scrollBegin.current = true;
          }}
        />
      </View>
      <ModalSearch
        isVisible={showModal}
        onClose={() => {
          setShowModal(false);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: appSize(16),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: appSize(50),
    paddingHorizontal: appSize(16),
  },
  titleHeader: {
    fontSize: appSize(20),
    fontWeight: 'bold',
    color: color.black,
  },
  titleEmptyFlatlist: {
    textAlign: 'center',
    fontSize: appSize(16),
  },
  contentEmpty: {
    alignItems: 'center',
    marginTop: appSize(100),
  },
});
