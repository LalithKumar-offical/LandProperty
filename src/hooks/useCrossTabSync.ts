import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchAllProperties } from '../slice/propertiesSlice';
import type { AppDispatch } from '../slice/store';

const channel = new BroadcastChannel('properties-sync');

export const useCrossTabSync = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'PROPERTIES_UPDATED') {
        dispatch(fetchAllProperties());
      }
    };

    channel.addEventListener('message', handleMessage);
    
    return () => {
      channel.removeEventListener('message', handleMessage);
    };
  }, [dispatch]);

  const notifyOtherTabs = () => {
    channel.postMessage({ type: 'PROPERTIES_UPDATED', timestamp: Date.now() });
  };

  return { notifyOtherTabs };
};