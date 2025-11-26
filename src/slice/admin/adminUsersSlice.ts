
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/interceptors";

export const fetchAllUsers = createAsyncThunk(
  "adminUsers/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/User");
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data ?? err.message);
    }
  }
);

export const updateUser = createAsyncThunk(
  "adminUsers/update",
  async (payload: any, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.put("/User", payload);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data ?? err.message);
    }
  }
);

export const deleteUser = createAsyncThunk(
  "adminUsers/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/User/${id}`);
      return id;
    } catch (err: any) {
      return rejectWithValue(err.response?.data ?? err.message);
    }
  }
);

const slice = createSlice({
  name: "adminUsers",
  initialState: {
    users: [] as any[],
    loading: false,
    error: null as string | null,
    initialized: false,
  },
  reducers: {
    invalidateCache: (state) => {
      state.initialized = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllUsers.pending, (s) => {
        s.loading = true; s.error = null;
      })
      .addCase(fetchAllUsers.fulfilled, (s, a) => {
        s.loading = false; s.users = a.payload; s.initialized = true;
      })
      .addCase(fetchAllUsers.rejected, (s, a) => {
        s.loading = false; s.error = a.payload as string;
      })
      .addCase(updateUser.fulfilled, (s, a) => {
        const idx = s.users.findIndex(u => u.userId === a.payload.userId || u.UserId === a.payload.UserId);
        if (idx >= 0) s.users[idx] = a.payload;
      })
      .addCase(deleteUser.fulfilled, (s, a) => {
        s.users = s.users.filter(u => (u.userId || u.UserId) !== a.payload);
      });
  },
});

export const { invalidateCache } = slice.actions;
export default slice.reducer;
