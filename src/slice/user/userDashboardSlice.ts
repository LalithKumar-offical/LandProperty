import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/interceptors';

interface UserDashboardState {
  properties: any[];
  bids: any[];
  applications: any[];
  loading: boolean;
  error: string | null;
}

const initialState: UserDashboardState = {
  properties: [],
  bids: [],
  applications: [],
  loading: false,
  error: null,
};

export const fetchUserDashboard = createAsyncThunk(
  'userDashboard/fetchData',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/User/dashboard');
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return rejectWithValue('Dashboard endpoint not available');
      }
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch dashboard');
    }
  }
);

const userDashboardSlice = createSlice({
  name: 'userDashboard',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.properties = action.payload.properties || [];
        state.bids = action.payload.bids || [];
        state.applications = action.payload.applications || [];
      })
      .addCase(fetchUserDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch user dashboard';
      });
  },
});

export const { clearError } = userDashboardSlice.actions;
export default userDashboardSlice.reducer;
