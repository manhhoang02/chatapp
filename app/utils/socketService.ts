import {io} from 'socket.io-client';
import Config from 'react-native-config';
const initSocket = () => {
  return io(`${Config.BASE_URI}`, {
    transports: ['websocket'],
  });
};

export default initSocket;
