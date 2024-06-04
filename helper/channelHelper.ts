import {useGetUserById} from 'app/api/auth';
import useAuthStore from 'app/store/authStore';

export const useGetChannelInfo = (channel: any) => {
  const userId = useAuthStore(s => s.user.id);

  let avatar = '';

  const friendId =
    Object.keys(channel.state.members).find(id => id !== userId) || '';
  const {data} = useGetUserById(friendId);

  const memberCount = channel.data.member_count;

  const channelName = channel.data?.name;
  const initials = channelName
    .split(' ')
    .map((word: string) => word[0])
    .join('');

  let shortenName = '';

  if (/\d$/.test(channelName)) {
    shortenName = `${initials[0]}+${initials[initials.length - 2]}`;
  } else {
    if (initials.length < 2) {
      shortenName = initials[0];
    } else {
      shortenName = `${initials[0]}+${initials[initials.length - 1]}`;
    }
  }

  if (memberCount < 3 && data) {
    avatar = data.avatar;
  } else {
    avatar = `https://getstream.io/random_png/?name=${shortenName}`;
  }

  const finalChannelName =
    memberCount < 3
      ? data?.firstName + ' ' + data?.lastName
      : channel.data.name;

  return {avatar, channelName: finalChannelName};
};
