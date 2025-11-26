
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/interceptors";

export const fetchAllHomes = createAsyncThunk("adminHomes/fetchAll", async (_, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.get("/HomeOwner");
    return res.data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data ?? err.message);
  }
});

export const approveHome = createAsyncThunk("adminHomes/approve", async (homeId: number, { rejectWithValue }) => {
  try {
    await axiosInstance.put ? axiosInstance.put(`/HomeOwner/${homeId}/approve`) : axiosInstance.post(`/HomeOwner/${homeId}/approve`);
    return homeId;
  } catch (err: any) {
    return rejectWithValue(err.response?.data ?? err.message);
  }
});

export const rejectHome = createAsyncThunk("adminHomes/reject", async ({ homeId, reason }: any, { rejectWithValue }) => {
  try {
    await axiosInstance.put(`/HomeOwner/${homeId}/reject?reason=${encodeURIComponent(reason)}`);
    return homeId;
  } catch (err: any) {
    return rejectWithValue(err.response?.data ?? err.message);
  }
});

const slice = createSlice({
  name: "adminHomes",
  initialState: { homes: [] as any[], loading: false, error: null as string | null },
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchAllHomes.pending, (s) => { s.loading = true; s.error = null; })
     .addCase(fetchAllHomes.fulfilled, (s, a) => { s.loading = false; s.homes = a.payload; })
     .addCase(fetchAllHomes.rejected, (s, a) => { s.loading = false; s.error = a.payload as string; });
   
  }
});

export default slice.reducer;
