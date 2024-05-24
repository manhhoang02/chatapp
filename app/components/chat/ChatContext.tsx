import React, {useState} from 'react';

type ChatContextType = {
  channel: any;
  setChannel: (channel: any) => void;
  thread: any;
  setThread: (thread: any) => void;
};

export const ChatContext = React.createContext<ChatContextType>({
  channel: null,
  setChannel: (_channel: any) => {},
  thread: null,
  setThread: (_thread: any) => {},
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
