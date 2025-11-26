import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getHomesWithOwnerAndDocs } from "../api/homeownerApi";
import { createHome, editHome } from "./homesSlice";

interface FullDetailsState {
  homes: any[];
  loading: boolean;
  error: string | null;
  lastFetch: number | null;
}

const initialState: FullDetailsState = {
  homes: [],
  loading: false,
  error: null,
  lastFetch: null
};

export const fetchAllFullDetails = createAsyncThunk(
  "fullDetails/fetchAll",
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState() as { fullDetails: FullDetailsState };
      const now = Date.now();
      const CACHE_DURATION = 30 * 60 * 1000;

      if (state.fullDetails.lastFetch && 
          (now - state.fullDetails.lastFetch) < CACHE_DURATION && 
          state.fullDetails.homes.length > 0) {
        return state.fullDetails.homes;
      }

      const response = await getHomesWithOwnerAndDocs();
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data ?? err.message);
    }
  },
  {
    condition: (_, { getState }) => {
      const state = getState() as { fullDetails: FullDetailsState };
      const now = Date.now();
      const CACHE_DURATION = 30 * 60 * 1000;
      
      if (state.fullDetails.loading) return false;
      if (state.fullDetails.lastFetch && 
          (now - state.fullDetails.lastFetch) < CACHE_DURATION && 
          state.fullDetails.homes.length > 0) {
        return false;
      }
      return true;
    }
  }
);

const fullDetailsSlice = createSlice({
  name: "fullDetails",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    invalidateCache: (state) => {
      state.lastFetch = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllFullDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllFullDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.homes = action.payload;
        state.lastFetch = Date.now();
      })
      .addCase(fetchAllFullDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createHome.pending, (state) => {
        state.loading = true;
      })
      .addCase(createHome.fulfilled, (state) => {
        state.loading = false;
        state.lastFetch = null;
      })
      .addCase(createHome.rejected, (state) => {
        state.loading = false;
      })
      .addCase(editHome.pending, (state) => {
        state.loading = true;
      })
      .addCase(editHome.fulfilled, (state) => {
        state.loading = false;
        state.lastFetch = null;
      })
      .addCase(editHome.rejected, (state) => {
        state.loading = false;
      });
  }
});

export const { clearError, invalidateCache } = fullDetailsSlice.actions;
export default fullDetailsSlice.reducer;