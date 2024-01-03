import {appSize} from '@abong.code/config/AppConstant';
import {consoleLog} from '@abong.code/helpers/logHelper';
import color from '@abong.code/theme/color';
import {Comment} from 'app/api/comment.type';
import moment from 'moment';
import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

export default function ({item}: {item: Comment}) {
  consoleLog(item, 'ee');
  return (
    <View style={styles.flex}>
      <View style={styles.content}>
        <Image
          source={
            item.author.avatar
              ? {uri: item.author.avatar}
              : require('assets/image/profile.png')
          }
          style={{
            width: appSize(40),
            height: appSize(40),
            marginRight: appSize(10),
            borderRadius: appSize(40),
          }}
          resizeMode="contain"
        />
        <View>
          <View style={styles.viewComment}>
            <Text style={styles.nameAuthor}>
              {item.author.first_name + ' ' + item.author.last_name}
            </Text>
            <Text style={{color: color.black}}>{item.text}</Text>
          </View>
          <View style={[styles.row, {padding: appSize(5)}]}>
            <Text style={styles.textAction}>
              {moment(item.createdAt).fromNow()}
            </Text>
            <TouchableOpacity style={{marginHorizontal: appSize(20)}}>
              <Text style={styles.textAction}>Thích</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text style={styles.textAction}>Phản hồi</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      {item.comments.map(cmt => {
        return (
          <View key={cmt._id} style={[styles.row, {marginLeft: appSize(50)}]}>
            <Image
              source={
                cmt.author.avatar
                  ? {uri: cmt.author.avatar}
                  : require('assets/image/profile.png')
              }
              style={{
                width: appSize(30),
                height: appSize(30),
                marginRight: appSize(10),
                borderRadius: appSize(40),
              }}
              resizeMode="contain"
            />
            <View>
              <View style={styles.viewComment}>
                <Text style={styles.nameAuthor}>
                  {cmt.author.first_name + ' ' + cmt.author.last_name}
                </Text>
                <Text style={{color: color.black}}>{cmt.text}</Text>
              </View>
              <View style={[styles.row, {padding: appSize(5)}]}>
                <Text style={styles.textAction}>
                  {moment(cmt.createdAt).fromNow()}
                </Text>
                <TouchableOpacity style={{marginHorizontal: appSize(20)}}>
                  <Text style={styles.textAction}>Thích</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {flexDirection: 'row'},
  flex: {flex: 1},
  content: {
    flexDirection: 'row',
  },
  viewComment: {
    backgroundColor: color.black006,
    padding: appSize(10),
    borderRadius: appSize(10),
  },
  nameAuthor: {
    fontWeight: 'bold',
    fontSize: appSize(16),
    marginBottom: appSize(5),
    color: color.black,
  },
  textAction: {
    color: color.textBtnLike,
    fontWeight: '600',
  },
});
