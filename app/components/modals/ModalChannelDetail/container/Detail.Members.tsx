import {FlatList} from 'react-native';
import React from 'react';
import {AppBlock, AppText} from '@starlingtech/element';
import {useChatContext} from 'app/components/chat/ChatContext';
import {useGetUserById} from 'app/api/auth';
import LinearAvatar from 'app/components/LinearAvatar';
import AppStyles from 'elements/AppStyles';
import color from '@abong.code/theme/color';

export default function () {
  const {channel} = useChatContext();

  const members = Object.keys(channel.state.members);
  const createdBy = channel.data.created_by.id;

  const renderItem = ({item}: any) => {
    const isAdmin = item === createdBy;

    return <Item id={item} isAdmin={isAdmin} />;
  };
  return (
    <FlatList
      data={members}
      renderItem={renderItem}
      keyExtractor={item => item.toString()}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={AppStyles.grow}
    />
  );
}

function Item({id, isAdmin}: {id: string; isAdmin: boolean}) {
  const {data} = useGetUserById(id);
  if (!data) {
    return null;
  }

  return (
    <AppBlock row alignItems="center" padding={[8, 12]}>
      <LinearAvatar uri={data.avatar} size={50} />
      <AppBlock ml={4} row flex justifyContent="space-between">
        <AppText size={16} weight="700">
          {data.firstName + ' ' + data.lastName}
        </AppText>
        {isAdmin && <AppText style={{color: color.btnTwitter}}>Admin</AppText>}
      </AppBlock>
    </AppBlock>
  );
}
