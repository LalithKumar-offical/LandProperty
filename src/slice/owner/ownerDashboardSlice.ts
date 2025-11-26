import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getOwnerDashboardSummary } from '../../api/homeownerApi';
import axiosInstance from '../../api/interceptors';

interface OwnerDashboardState {
  homes: any[];
  lands: any[];
  loading: boolean;
  error: string | null;
  initialized: boolean;
  currentUserId: string | null;
}

const initialState: OwnerDashboardState = {
  homes: [],
  lands: [],
  loading: false,
  error: null,
  initialized: false,
  currentUserId: null,
};

export const fetchOwnerDashboard = createAsyncThunk(
  'ownerDashboard/fetchData',
  async (userId: string, { rejectWithValue }) => {
    try {
      // Try the dashboard summary API first
      try {
        const response = await getOwnerDashboardSummary(userId);
        return response.data;
      } catch (dashboardError) {
        // Fallback to individual API calls
        const homeData = await axiosInstance.get('/HomeOwner');
        const landData = await axiosInstance.get('/LandOwner');
        
        const userHomes = homeData.data.filter((home: any) => home.UserId === userId);
        const userLands = landData.data.filter((land: any) => land.UserId === userId);
        
        return {
          homes: userHomes,
          lands: userLands
        };
      }
    } catch (err: any) {
      return rejectWithValue(err.response?.data ?? err.message);
    }
  }
);

const ownerDashboardSlice = createSlice({
  name: 'ownerDashboard',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    invalidateCache: (state) => {
      state.initialized = false;
      state.homes = [];
      state.lands = [];
    },
    checkUserChange: (state, action) => {
      const newUserId = action.payload;
      if (state.currentUserId && state.currentUserId !== newUserId) {
        state.initialized = false;
        state.homes = [];
        state.lands = [];
      }
      state.currentUserId = newUserId;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOwnerDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOwnerDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.homes = action.payload.homes || [];
        state.lands = action.payload.lands || [];
        state.initialized = true;
      })
      .addCase(fetchOwnerDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch owner dashboard';
      });
  },
});

export const { clearError, invalidateCache, checkUserChange } = ownerDashboardSlice.actions;
export default ownerDashboardSlice.reducer;
