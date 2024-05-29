import {FlatList, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import color from '@abong.code/theme/color';
import {AppBlock, AppText, appSize} from '@starlingtech/element';
import moment from 'moment';
import AppStyles from 'elements/AppStyles';
import {useGetNotifications} from 'app/api/notification';
import {useRefresh} from 'app/hook/useRefresh';

export default function Notifications() {
  const {data: notifications, refetch} = useGetNotifications();

  const {isRefreshing, onRefresh} = useRefresh(refetch);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Thông báo</Text>
      <FlatList
        refreshing={isRefreshing}
        onRefresh={onRefresh}
        data={notifications}
        renderItem={({item}) => {
          return (
            <AppBlock style={styles.item}>
              <AppText weight="700">{item.title}</AppText>
              <AppBlock style={AppStyles.rowCenterBetween}>
                <AppText size={13} color="backdrop">
                  {item.body}
                </AppText>
                <AppText size={11}>{moment(item.time).fromNow(true)}</AppText>
              </AppBlock>
            </AppBlock>
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
