import {useGetPosts} from 'app/api/post';
import {Post} from 'app/api/post.type';
import AppContainer from 'app/components/Global/AppContainer';
import ItemPost from 'app/components/ItemPost';
import {useRefresh} from 'app/hook/useRefresh';
import useAuthStore from 'app/store/authStore';
import {useHomeStore} from 'app/store/homeStore';
import React from 'react';
import {StyleSheet} from 'react-native';
import {KeyboardAwareFlatList} from 'react-native-keyboard-aware-scroll-view';
import HomeHeader from './container/Home.Header';

export default function () {
  const user = useAuthStore(s => s.user);

  const sync = useHomeStore(s => s.sync);

  const {data, refetch} = useGetPosts({
    reload: sync.post || sync.friend,
    userId: user.id,
  });

  const renderItem = ({item}: {item: Post}) => {
    return <ItemPost item={item} />;
  };

  const {isRefreshing, onRefresh} = useRefresh(refetch);

  return (
    <AppContainer>
      <KeyboardAwareFlatList
        refreshing={isRefreshing}
        onRefresh={onRefresh}
        data={data}
        keyExtractor={(_, index) => index.toString()}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        ListHeaderComponentStyle={styles.header}
        ListHeaderComponent={<HomeHeader />}
      />
    </AppContainer>
  );
}
const styles = StyleSheet.create({
  header: {marginBottom: 8},
});
