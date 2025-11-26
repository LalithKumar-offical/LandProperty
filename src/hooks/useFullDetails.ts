import { useCallback, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../slice/store';
import { fetchAllFullDetails } from '../slice/fullDetailsSlice';

export const useFullDetails = () => {
  const dispatch = useDispatch();
  const fetchingRef = useRef(false);
  const { homes, loading, error, lastFetch } = useSelector(
    (state: RootState) => state.fullDetails
  );

  const fetchData = useCallback(() => {
    if (!fetchingRef.current && !loading) {
      fetchingRef.current = true;
      dispatch(fetchAllFullDetails()).finally(() => {
        fetchingRef.current = false;
      });
    }
  }, [dispatch, loading]);

  const refresh = useCallback(() => {
    if (!fetchingRef.current) {
      fetchingRef.current = true;
      dispatch(fetchAllFullDetails()).finally(() => {
        fetchingRef.current = false;
      });
    }
  }, [dispatch]);

  // Auto-refresh when cache is invalidated
  useEffect(() => {
    if (!lastFetch && !loading && !fetchingRef.current) {
      fetchData();
    }
  }, [lastFetch, loading, fetchData]);

  return {
    homes,
    loading,
    error,
    lastFetch,
    fetchData,
    refresh,
    totalProperties: homes.length
  };
};