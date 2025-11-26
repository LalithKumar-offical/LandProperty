// adminDashboardSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/interceptors";

export const fetchAdminOverview = createAsyncThunk(
  "admin/fetchOverview",
  async (_, { rejectWithValue }) => {
    try {
      const [usersRes, homesRes, landsRes, pendingHomesRes, pendingLandsRes, logsRes] = await Promise.all([
        axiosInstance.get("/User"),
        axiosInstance.get("/HomeOwner"),
        axiosInstance.get("/LandOwner"),
        axiosInstance.get("/HomeOwner/pending"),
        axiosInstance.get("/LandOwner/pending"),
        axiosInstance.get("/Logger"),
      ]);

      // For bids total we will fetch counts when needed (or extend backend)
      return {
        users: usersRes.data,
        homes: homesRes.data,
        lands: landsRes.data,
        pendingHomes: pendingHomesRes.data,
        pendingLands: pendingLandsRes.data,
        logs: logsRes.data,
      };
    } catch (err: any) {
      return rejectWithValue(err.response?.data ?? err.message);
    }
  }
);

interface AdminOverviewState {
  loading: boolean;
  error: string | null;
  users: any[];
  homes: any[];
  lands: any[];
  pendingHomes: any[];
  pendingLands: any[];
  logs: any[];
}

const initialState: AdminOverviewState = {
  loading: false,
  error: null,
  users: [],
  homes: [],
  lands: [],
  pendingHomes: [],
  pendingLands: [],
  logs: [],
};

const adminDashboardSlice = createSlice({
  name: "adminDashboard",
  initialState,
  reducers: {
    clearAdminDashboardError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminOverview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminOverview.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.users ?? [];
        state.homes = action.payload.homes ?? [];
        state.lands = action.payload.lands ?? [];
        state.pendingHomes = action.payload.pendingHomes ?? [];
        state.pendingLands = action.payload.pendingLands ?? [];
        state.logs = action.payload.logs ?? [];
      })
      .addCase(fetchAdminOverview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearAdminDashboardError } = adminDashboardSlice.actions;
export default adminDashboardSlice.reducer;
