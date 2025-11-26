import { createAsyncThunk } from '@reduxjs/toolkit';
import { loginUser as loginAPI, logoutUser as logoutAPI } from '../../api/authApi';

export const loginUserThunk = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }) => {
    const response = await loginAPI(credentials);
    return response.User || response.user;
  }
);

export const logoutUserThunk = createAsyncThunk(
  'auth/logout',
  async () => {
    await logoutAPI();
  }
);
