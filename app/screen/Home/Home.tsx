import {recentlyPostListener} from 'app/api/post';
import {Post} from 'app/api/post.type';
import AppContainer from 'app/components/Global/AppContainer';
import ItemPost from 'app/components/ItemPost';
import React, {useEffect} from 'react';
import {StyleSheet} from 'react-native';
import {KeyboardAwareFlatList} from 'react-native-keyboard-aware-scroll-view';
import HomeHeader from './container/Home.Header';
import {useDataStore} from 'app/store/dataStore';
import {useRefresh} from 'app/hook/useRefresh';

export default function () {
  const data = useDataStore(s => s.recentlyData.postData);

  useEffect(() => {
    const subscriber = recentlyPostListener();
    return subscriber;
  }, []);

  const renderItem = ({item}: {item: Post}) => {
    return <ItemPost item={item} />;
  };

  const {isRefreshing, onRefresh} = useRefresh(recentlyPostListener);

  return (
    <AppContainer>
      <KeyboardAwareFlatList
        data={data}
        refreshing={isRefreshing}
        onRefresh={onRefresh}
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
