import { createSlice } from '@reduxjs/toolkit';
import type { BidResponse } from '../../types/bidsType';

interface UserBidsState {
  bids: BidResponse[];
  loading: boolean;
}

const initialState: UserBidsState = {
  bids: [],
  loading: false,
};

const userBidsSlice = createSlice({
  name: 'userBids',
  initialState,
  reducers: {
    setBids: (state, action) => {
      state.bids = action.payload;
    },
    addBid: (state, action) => {
      state.bids.push(action.payload);
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { setBids, addBid, setLoading } = userBidsSlice.actions;
export default userBidsSlice.reducer;
