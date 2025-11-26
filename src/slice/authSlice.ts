import { createSlice } from "@reduxjs/toolkit";
import { loginUserThunk, logoutUserThunk } from "./thunks/authThunks";

interface AuthState {
  user: any | null;
  loading: boolean;
  error: string | null;
}

const loadUser = () => {
  const stored = localStorage.getItem("user");
  return stored ? JSON.parse(stored) : null;
};

const saveUser = (user: any) => {
  localStorage.setItem("user", JSON.stringify(user));
};

const removeUser = () => {
  localStorage.removeItem("user");
};

const initialState: AuthState = {
  user: loadUser(),
  loading: false,
  error: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload;
      saveUser(action.payload);
    },
    logout: (state) => {
      state.user = null;
      removeUser();
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUserThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUserThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        saveUser(action.payload);
      })
      .addCase(loginUserThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Login failed';
      })
      .addCase(logoutUserThunk.fulfilled, (state) => {
        state.user = null;
        removeUser();
      });
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
