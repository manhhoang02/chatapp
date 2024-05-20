// AppContext.js

import React, {useState} from 'react';

export const ChatContext = React.createContext({
  channel: null,
  setChannel: (_channel: string) => {},
  thread: null,
  setThread: (_thread: string) => {},
});

export const ChatProvider = ({children}: any) => {
  const [channel, setChannel] = useState();
  const [thread, setThread] = useState();

  return (
    <ChatContext.Provider value={{channel, setChannel, thread, setThread}}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => React.useContext(ChatContext);
