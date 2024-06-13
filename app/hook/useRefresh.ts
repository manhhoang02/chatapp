import {useState} from 'react';

export function useRefresh(refetch: () => Promise<any> | any) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  async function onRefresh() {
    setIsRefreshing(true);

    try {
      await refetch();
    } finally {
      setIsRefreshing(false);
    }
  }

  return {
    isRefreshing,
    onRefresh,
  };
}
