import {Post} from 'app/api/post.type';
import React, {useState} from 'react';

type MediaType = {
  uri: string;
  name: string;
};

type HomeContextType = {
  media: MediaType[];
  setMedia: React.Dispatch<React.SetStateAction<MediaType[]>>;
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  data: Post | null;
  setData: React.Dispatch<React.SetStateAction<Post | null>>;
};

export const HomeContext = React.createContext<HomeContextType>({
  media: [],
  setMedia: () => [],
  visible: false,
  setVisible: () => {},
  data: null,
  setData: () => {},
});

export const HomeProvider = ({children}: {children: React.ReactNode}) => {
  const [media, setMedia] = useState<MediaType[]>([]);
  const [visible, setVisible] = useState<boolean>(false);
  const [data, setData] = useState<Post | null>(null);

  return (
    <HomeContext.Provider
      value={{media, setMedia, visible, setVisible, data, setData}}>
      {children}
    </HomeContext.Provider>
  );
};

export const useHomeContext = () => React.useContext(HomeContext);
