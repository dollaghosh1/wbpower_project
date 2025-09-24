import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/api'


const token = localStorage.getItem('token');

export const fetchUser = createAsyncThunk(
  'auth/fetchUser',
  async (_, thunkAPI) => {
    const token = localStorage.getItem('token');
    if (!token) {
      return thunkAPI.rejectWithValue('No token found');
    }

    try {
      const response = await api.get('/userdetails', {
        headers: {
          Authorization: `Bearer ${token}`, // if needed
        }
      });

      // response.data might be like { data: { name: "...", email: "...", ... } }
      const user = response.data.data; // adjust based on your API

      // Optional: store user in localStorage
      localStorage.setItem('user', JSON.stringify(user));

      return user; // return only the user object
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || 'Failed to fetch user');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isAuthenticated: !!token,
    token: token || null,
  },
  reducers: {
    login(state, action) {
      state.isAuthenticated = true;
      state.token = action.payload.token;
      localStorage.setItem('token', action.payload.token);
    },
    logout(state) {
      state.isAuthenticated = false;
      state.token = null;
      localStorage.removeItem('token');
      localStorage.removeItem("user");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.loadingUser = true;
        state.userError = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.loadingUser = false;
        state.user = action.payload;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.loadingUser = false;
        state.userError = action.payload;
      });
  },
});

export const { login, logout } = authSlice.actions;
export const selectAuthUser = (state) => state.auth.user;
export default authSlice.reducer;
