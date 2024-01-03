import React, {useEffect, useRef, useState} from 'react';
import AppConstant, {appSize} from '@abong.code/config/AppConstant';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import {StyleSheet, View} from 'react-native';
import Modal from 'react-native-modal';
import color from '@abong.code/theme/color';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {BlurView} from '@react-native-community/blur';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Foundation from 'react-native-vector-icons/Foundation';
import {Friend} from 'app/api/auth.type';
import {useFindUsers} from 'app/api/auth';
import {useNavigation} from '@react-navigation/native';
import {ParamsStack} from 'app/navigation/params';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

type Props = {
  isVisible: boolean;
  onClose: () => void;
};
export default function ({isVisible, onClose}: Props) {
  const {top} = useSafeAreaInsets();
  const navigation = useNavigation<NativeStackNavigationProp<ParamsStack>>();

  const noLoadMore = useRef(false);
  const prevData = useRef<Friend[]>([]);
  const refreshing = useRef<boolean>(false);
  const scrollBegin = useRef(false);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [resData, setResData] = useState<Friend[]>([]);

  const {data, isSuccess, isError, isFetchedAfterMount} = useFindUsers(
    page,
    AppConstant.LIST_SIZE,
    search,
  );
  const renderItem = ({item}: {item: Friend}) => {
    return (
      <View>
        <TouchableOpacity
          style={styles.card}
          onPress={() => {
            onClose();
            navigation.navigate('Profile', {id: item._id});
          }}>
          <Image
            source={
              item?.avatar
                ? {uri: item?.avatar}
                : require('assets/image/profile.png')
            }
            style={styles.avatar}
          />
          <View style={styles.center}>
            <Text style={styles.nameChat}>
              {item.first_name + ' ' + item.last_name}
            </Text>
            <Text style={{color: color.black04}}>{item.email}</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  const ListEmptyComponent = isFetchedAfterMount ? (
    <View style={styles.contentEmpty}>
      <Foundation name="page-search" size={100} />
      <Text style={styles.titleEmptyFlatlist}>Không tìm thấy kết quả.</Text>
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
    if (isSuccess && data) {
      refreshing.current = false;
      if (page === 1) {
        prevData.current = data || [];
      } else {
        prevData.current = [...prevData.current, ...data];
      }
      setResData(prevData.current);
      noLoadMore.current = data.length < AppConstant.LIST_SIZE;
    } else if (isError) {
      noLoadMore.current = true;
    }
  }, [page, data, isSuccess, isError]);
  return (
    <Modal
      animationIn={'fadeInDown'}
      animationOut={'fadeOutUp'}
      animationInTiming={300}
      animationOutTiming={300}
      backdropColor="transparent"
      isVisible={isVisible}
      style={[styles.modal, styles.noMargin]}
      onBackdropPress={onClose}>
      <BlurView
        style={styles.blur}
        blurType="xlight"
        blurAmount={8}
        overlayColor="transparent">
        <View style={[styles.container, {paddingTop: top}]}>
          <View style={styles.header}>
            <Ionicons
              name="ios-close-circle-outline"
              size={24}
              onPress={onClose}
              color={color.black}
            />
          </View>
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Tìm kiếm bạn mới"
            autoCapitalize="none"
            style={styles.textInput}
            placeholderTextColor={color.black04}
          />
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
      </BlurView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    height: '80%',
    // borderWidth: appSize(1),
    borderColor: color.black04,
    borderBottomLeftRadius: appSize(10),
    borderBottomRightRadius: appSize(10),
    paddingHorizontal: appSize(16),
  },
  noMargin: {
    marginHorizontal: 0,
    marginVertical: 0,
  },
  modal: {
    justifyContent: 'flex-start',
  },
  blur: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  textInput: {
    borderWidth: appSize(1),
    marginTop: appSize(10),
    marginHorizontal: appSize(40),
    padding: appSize(10),
    borderRadius: appSize(20),
    borderColor: color.primary,
    color: color.primary,
    marginBottom: appSize(30),
  },
  titleEmptyFlatlist: {
    textAlign: 'center',
    fontSize: appSize(16),
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: appSize(30),
  },
  avatar: {
    height: appSize(50),
    width: appSize(50),
    borderRadius: appSize(50),
    marginRight: appSize(10),
  },
  nameChat: {
    fontSize: appSize(16),
    fontWeight: 'bold',
    marginBottom: appSize(5),
    color: color.black,
  },
  center: {justifyContent: 'center'},
  contentEmpty: {
    alignItems: 'center',
    marginTop: appSize(100),
  },
});
