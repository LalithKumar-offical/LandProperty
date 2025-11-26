import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAllLogs } from "../../api/loggerApi";
import type { LogEntry } from "../../types/loggerType";

interface AdminLogsState {
  logs: LogEntry[];
  loading: boolean;
  error: string | null;
  initialized: boolean;
}

const initialState: AdminLogsState = {
  logs: [],
  loading: false,
  error: null,
  initialized: false,
};

export const fetchAllLogs = createAsyncThunk(
  "adminLogs/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const data = await getAllLogs();
      return data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data ?? err.message);
    }
  }
);

const adminLogsSlice = createSlice({
  name: "adminLogs",
  initialState,
  reducers: {
    invalidateCache: (state) => {
      state.initialized = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllLogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllLogs.fulfilled, (state, action) => {
        state.loading = false;
        state.logs = action.payload;
        state.initialized = true;
      })
      .addCase(fetchAllLogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { invalidateCache } = adminLogsSlice.actions;
export default adminLogsSlice.reducer;