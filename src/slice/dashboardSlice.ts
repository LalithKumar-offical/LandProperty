import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getDashboardSummary } from '../api/adminDashboardApi';

export const fetchDashboardSummary = createAsyncThunk(
  'dashboard/fetchSummary',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getDashboardSummary();
      return response;
    } catch (err: any) {
      return rejectWithValue(err.response?.data ?? err.message);
    }
  }
);

interface DashboardState {
  users: any[];
  homes: any[];
  lands: any[];
  loading: boolean;
  error: string | null;
  initialized: boolean;
  lastFetched: number | null;
}

const initialState: DashboardState = {
  users: [],
  homes: [],
  lands: [],
  loading: false,
  error: null,
  initialized: false,
  lastFetched: null,
};

export const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    invalidateCache: (state) => {
      state.initialized = false;
      state.lastFetched = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardSummary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardSummary.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.users || [];
        state.homes = action.payload.homes || [];
        state.lands = action.payload.lands || [];
        state.initialized = true;
        state.lastFetched = Date.now();
      })
      .addCase(fetchDashboardSummary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { invalidateCache } = dashboardSlice.actions;
export default dashboardSlice.reducer;
