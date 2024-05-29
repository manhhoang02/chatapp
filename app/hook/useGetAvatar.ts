export const getStreamAvatar = (channel: any) => {
  const channelName = channel.data?.name;
  const initials = channelName
    .split(' ')
    .map((word: string) => word[0])
    .join('');

  let shortenName = '';

  if (initials.length < 2) {
    shortenName = initials[0];
  } else {
    shortenName = `${initials[0]}+${initials[initials.length - 1]}`;
  }

  const avatar = `https://getstream.io/random_png/?name=${shortenName}`;

  return {avatar};
};
