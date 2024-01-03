import AppConstant, {appSize} from '@abong.code/config/AppConstant';
import {useAppContext} from '@abong.code/context/AppProvider';
import color from '@abong.code/theme/color';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {getProfileMe, useGetFriendList} from 'app/api/auth';
import {Friend} from 'app/api/auth.type';
import Header from 'app/components/Header';
import {ParamsStack} from 'app/navigation/params';
import moment from 'moment';
import React, {useEffect, useRef, useState} from 'react';
import {FlatList, TouchableOpacity} from 'react-native';
import {Text} from 'react-native';
import {StyleSheet, View} from 'react-native';
import {ActivityIndicator} from 'react-native-paper';
import Feather from 'react-native-vector-icons/Feather';
import ItemFriendList from './container/ItemFriendList';

export default function () {
  const {user, setUser, syncData, socket} = useAppContext();
  const navigation = useNavigation<NativeStackNavigationProp<ParamsStack>>();
  const noLoadMore = useRef(false);
  const prevData = useRef<Friend[]>([]);
  const refreshing = useRef<boolean>(false);
  const scrollBegin = useRef(false);

  const [friends, setFriends] = useState<Friend[]>([]);
  const [userSelect, setUserSelect] = useState<Friend>();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [dataMount, setDataMount] = useState(false); // check data đã đc mount vào flatlist hay chưa
  const [reload, setReload] = useState(0);

  const {data, isSuccess, isError, isFetchedAfterMount} = useGetFriendList(
    search,
    page,
    AppConstant.LIST_SIZE,
    reload,
  );

  const renderItem = ({item}: {item: Friend}) => {
    return (
      <ItemFriendList
        item={item}
        userSelect={userSelect}
        setUserSelect={setUserSelect}
      />
    );
  };

  const right = (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('FriendRequests');
      }}>
      <Feather name="user-plus" size={24} color={color.primary} />
      {user.friend_requests.length > 0 && (
        <View style={styles.badge}>
          <Text style={styles.textBadge}>
            {user.friend_requests.length <= 99
              ? user.friend_requests.length
              : 99}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
  const ListEmptyComponent =
    isFetchedAfterMount && dataMount ? (
      <View>
        <Text style={styles.titleEmptyFlatlist}>
          Không có bạn bè để hiển thị.
        </Text>
      </View>
    ) : null;

  if (isFetchedAfterMount) {
    refreshing.current = false;
  }
  const onRefresh = () => {
    refreshing.current = true;
    setDataMount(false);
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
      setFriends(prevData.current);
      setDataMount(true);
      noLoadMore.current = data.users.length < AppConstant.LIST_SIZE;
    } else if (isError) {
      noLoadMore.current = true;
    }
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

  return (
    <View style={styles.container}>
      <View style={styles.boxChats}>
        <FlatList
          refreshing={refreshing.current}
          onRefresh={onRefresh}
          data={friends}
          keyExtractor={(_, index) => index.toString()}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingTop: appSize(150),
            paddingBottom: appSize(90),
          }}
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
      <Header
        title="Bạn bè"
        right={right}
        showSearch
        onChangeText={text => {
          setFriends([]);
          setDataMount(false);
          setTimeout(() => {
            setSearch(text);
            setPage(1);
          }, 100);
        }}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  boxChats: {
    flex: 1,
    paddingHorizontal: appSize(16),
  },
  titleEmptyFlatlist: {
    textAlign: 'center',
    fontSize: appSize(16),
  },
  badge: {
    backgroundColor: color.red,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: appSize(100),
    position: 'absolute',
    right: -10,
    top: -15,
    width: appSize(20),
    height: appSize(20),
  },
  textBadge: {
    fontSize: appSize(12),
    color: color.white,
    fontWeight: 'bold',
  },
});
