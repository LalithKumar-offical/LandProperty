import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getHomesWithOwnerAndDocs } from "../api/homeownerApi";
import { getLandsWithOwnerAndDocs } from "../api/landownerApi";

export const fetchAllProperties = createAsyncThunk("properties/fetchAll", async (_, { rejectWithValue }) => {
  try {
    const [homeResponse, landResponse] = await Promise.all([
      getHomesWithOwnerAndDocs(),
      getLandsWithOwnerAndDocs()
    ]);
    
    return {
      homes: homeResponse.data || [],
      lands: landResponse.data || []
    };
  } catch (err: any) {
    return rejectWithValue(err.response?.data ?? err.message);
  }
});

const propertiesSlice = createSlice({
  name: "properties",
  initialState: { 
    homes: [] as any[], 
    lands: [] as any[],
    loading: false, 
    error: null as string | null,
    lastFetched: null as number | null,
    initialized: false
  },
  reducers: {
    triggerRefresh: (state) => {
      // This action will trigger a re-fetch in components
      state.lastFetched = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllProperties.pending, (state) => { 
        state.loading = true; 
        state.error = null; 
      })
      .addCase(fetchAllProperties.fulfilled, (state, action) => { 
        state.loading = false; 
        state.homes = action.payload.homes;
        state.lands = action.payload.lands;
        state.lastFetched = Date.now();
        state.initialized = true;
      })
      .addCase(fetchAllProperties.rejected, (state, action) => { 
        state.loading = false; 
        state.error = action.payload as string; 
      });
  }
});

export const { triggerRefresh } = propertiesSlice.actions;
export default propertiesSlice.reducer;