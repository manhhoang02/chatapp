import {StyleSheet} from 'react-native';
import React, {useState} from 'react';
import {
  AppBlock,
  AppText,
  AppTouchableOpacity,
  appSize,
} from '@starlingtech/element';
import color from '@abong.code/theme/color';
import {Resp_User} from 'app/api/auth.type';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AppStyles from 'elements/AppStyles';

interface Props {
  item: Resp_User;
}

export default function ProfileInfo({item}: Props) {
  const [show, setShow] = useState(false);
  const toggleShow = () => setShow(!show);
  return (
    <AppBlock
      border={[0, 0, 1]}
      pv={8}
      style={{borderBottomWidth: appSize(1), borderColor: color.placeholder}}>
      <AppTouchableOpacity style={AppStyles.rowCenter} onPress={toggleShow}>
        <AppText style={styles.title} mr={8}>
          Chi tiết
        </AppText>
        <Ionicons
          name="chevron-down-outline"
          size={16}
          style={{transform: [{rotate: show ? '180deg' : '0deg'}]}}
        />
      </AppTouchableOpacity>
      {show && (
        <AppBlock>
          <Item
            title="Họ và tên"
            value={item.firstName + ' ' + item.lastName}
          />
          <Item title="Email" value={item.email} />
          <Item title="Ngày sinh" value={item.dateOfBirth} />
          <Item
            title="Giới tính"
            value={item.gender === 'male' ? 'Nam' : 'Nữ'}
          />
          {/* <Item
          title="Tham gia vào"
          value={moment(item.firstName).format('DD-MM-YYYY')}
          /> */}
        </AppBlock>
      )}
    </AppBlock>
  );
}

function Item({title, value}: {title: string; value: string}) {
  return (
    <AppBlock row alignItems="center" mv={3}>
      <AppText width={100} color={color.textBtnLike}>
        {title}:
      </AppText>
      <AppText weight="700">{value}</AppText>
    </AppBlock>
  );
}

const styles = StyleSheet.create({
  title: {
    fontWeight: 'bold',
    color: color.black,
    fontSize: 16,
  },
});
