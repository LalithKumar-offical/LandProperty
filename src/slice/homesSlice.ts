import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { addHome, updateHome, getHomesWithOwnerAndDocs } from "../api/homeownerApi";
import { fetchAllProperties } from "./propertiesSlice";

export const createHome = createAsyncThunk("homes/create", async (homeData: any, { rejectWithValue }) => {
  try {
    const response = await addHome(homeData);
    return response.data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data ?? err.message);
  }
});

export const editHome = createAsyncThunk("homes/update", async (homeData: any, { rejectWithValue }) => {
  try {
    const response = await updateHome(homeData);
    return response.data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data ?? err.message);
  }
});

export const fetchHomes = createAsyncThunk(
  "homes/fetchAll",
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState() as { homes: HomesState };
      const now = Date.now();
      const CACHE_DURATION = 30 * 60 * 1000;
      
      if (state.homes.lastFetch && (now - state.homes.lastFetch) < CACHE_DURATION && state.homes.homes.length > 0) {
        return state.homes.homes;
      }
      
      const response = await getHomesWithOwnerAndDocs();
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data ?? err.message);
    }
  },
  {
    condition: (_, { getState }) => {
      const state = getState() as { homes: HomesState };
      return !state.homes.loading;
    }
  }
);

interface Home {
  HomeId: number;
  HomeName: string;
  HomeDescription: string;
  HomeAddress: string;
  HomeCity: string;
  HomeState: string;
  HomePincode: string;
  HomeAreaInSqFt: number;
  HomePriceInitial: number;
  UserId: string;
  HomeStatusApproved: boolean;
  HomeStatusActive: boolean;
  Type: string;
}

interface HomesState {
  homes: Home[];
  loading: boolean;
  error: string | null;
  lastFetch: number | null;
}

const initialState: HomesState = {
  homes: [],
  loading: false,
  error: null,
  lastFetch: null
};

const homesSlice = createSlice({
  name: "homes",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHomes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHomes.fulfilled, (state, action) => {
        state.loading = false;
        state.homes = action.payload;
        state.lastFetch = Date.now();
      })
      .addCase(fetchHomes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createHome.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createHome.fulfilled, (state) => {
        state.loading = false;
        state.lastFetch = null; // Invalidate cache
      })
      .addCase(createHome.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(editHome.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editHome.fulfilled, (state) => {
        state.loading = false;
        state.lastFetch = null; // Invalidate cache
      })
      .addCase(editHome.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

export const { clearError } = homesSlice.actions;

export default homesSlice.reducer;