import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getUserById, updateUser } from "../api/userApi";

export const fetchProfile = createAsyncThunk(
  "profile/fetch", 
  async (userId: string, { rejectWithValue, getState }) => {
    try {
      const state = getState() as { profile: any };
      
      // Check if we already have this user's profile cached
      if (state.profile.currentUserId === userId && 
          state.profile.initialized && 
          state.profile.profile) {
        return state.profile.profile;
      }
      
      const profile = await getUserById(userId);
      return profile;
    } catch (err: any) {
      return rejectWithValue(err.response?.data ?? err.message);
    }
  },
  {
    condition: (userId, { getState }) => {
      const state = getState() as { profile: any };
      
      // Don't fetch if already loading
      if (state.profile.loading) return false;
      
      // Don't fetch if we have current user's data cached
      if (state.profile.currentUserId === userId && 
          state.profile.initialized && 
          state.profile.profile) {
        return false;
      }
      
      return true;
    }
  }
);

export const updateProfile = createAsyncThunk("profile/update", async (userData: any, { rejectWithValue }) => {
  try {
    await updateUser(userData);
    const updatedProfile = await getUserById(userData.userId);
    return updatedProfile;
  } catch (err: any) {
    return rejectWithValue(err.response?.data ?? err.message);
  }
});

const profileSlice = createSlice({
  name: "profile",
  initialState: { 
    profile: null as any, 
    loading: false, 
    error: null as string | null,
    lastFetched: null as number | null,
    initialized: false,
    currentUserId: null as string | null
  },
  reducers: {
    invalidateCache: (state) => {
      state.initialized = false;
      state.lastFetched = null;
      state.profile = null;
      state.currentUserId = null;
    },
    checkUserChange: (state, action) => {
      const newUserId = action.payload;
      if (state.currentUserId && state.currentUserId !== newUserId) {
        state.initialized = false;
        state.lastFetched = null;
        state.profile = null;
      }
      state.currentUserId = newUserId;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => { 
        state.loading = true; 
        state.error = null; 
      })
      .addCase(fetchProfile.fulfilled, (state, action) => { 
        state.loading = false; 
        state.profile = action.payload;
        state.lastFetched = Date.now();
        state.initialized = true;
        state.currentUserId = action.payload?.UserId || action.payload?.userId;
      })
      .addCase(fetchProfile.rejected, (state, action) => { 
        state.loading = false; 
        state.error = action.payload as string; 
      })
      .addCase(updateProfile.fulfilled, (state, action) => { 
        state.profile = action.payload;
        state.lastFetched = Date.now();
      });
  }
});

export const { invalidateCache, checkUserChange } = profileSlice.actions;
export default profileSlice.reducer;