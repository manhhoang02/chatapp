import {Alert, FlatList, Pressable, StyleSheet, Text, View} from 'react-native';
import React, {useEffect} from 'react';
import color from '@abong.code/theme/color';
import {AppBlock, AppText, appSize} from '@starlingtech/element';
import moment from 'moment';
import AppStyles from 'elements/AppStyles';
import {
  deleteNotification,
  recentlyNotificationListener,
} from 'app/api/notification';
import {useRefresh} from 'app/hook/useRefresh';
import {showToastMessageSuccess} from '@abong.code/helpers/messageHelper';
import {useDataStore} from 'app/store/dataStore';

export default function Notifications() {
  const notificationData = useDataStore(s => s.recentlyData.notificationData);

  useEffect(() => {
    const subscriber = recentlyNotificationListener();
    return subscriber;
  }, []);

  const {isRefreshing, onRefresh} = useRefresh(recentlyNotificationListener);

  const onDeleteNotification = (id: string) => {
    Alert.alert('Xác nhận', 'Bạn có chắc chắn muốn xóa thông báo này?', [
      {
        text: 'Hủy',
        style: 'cancel',
      },
      {
        text: 'Xóa',
        onPress: () => {
          deleteNotification(id).then(() => {
            showToastMessageSuccess('Xóa thông báo thành công');
          });
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <AppBlock style={AppStyles.rowCenterBetween}>
        <Text style={styles.title}>Thông báo</Text>
        {/* <Ionicons
          name="trash-outline"
          size={20}
          color={color.placeholder}
          onPress={onDeleteAllNotification}
        /> */}
      </AppBlock>
      <FlatList
        refreshing={isRefreshing}
        onRefresh={onRefresh}
        data={notificationData}
        renderItem={({item}) => {
          return (
            <Pressable
              style={styles.item}
              onLongPress={() => onDeleteNotification(item.id)}>
              <AppText weight="700">{item.title}</AppText>
              <AppBlock style={AppStyles.rowCenterBetween}>
                <AppText size={13} color="backdrop">
                  {item.body}
                </AppText>
                <AppText size={11}>{moment(item.time).fromNow(true)}</AppText>
              </AppBlock>
            </Pressable>
          );
        }}
        keyExtractor={item => item.id}
        contentContainerStyle={AppStyles.grow}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <AppBlock flex center>
            <AppText size={50}>🤷‍♂️</AppText>
            <Text style={styles.titleEmpty}>
              Không có thông báo để hiển thị.
            </Text>
          </AppBlock>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: color.primary,
    marginVertical: 10,
  },
  titleEmpty: {
    textAlign: 'center',
    fontSize: appSize(16),
  },
  container: {
    flex: 1,
    paddingHorizontal: 12,
    backgroundColor: color.white,
  },
});
