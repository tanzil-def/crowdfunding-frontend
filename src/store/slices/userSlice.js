import { createSlice } from '@reduxjs/toolkit';

const savedUser = localStorage.getItem("user");
const user = savedUser ? JSON.parse(savedUser) : null;

const initialState = {
  user: user,
  isAuthenticated: !!user,
  isUserLoggedIn: !!user,
  role: user ? user.role : null,
  propertiesList: user ? (user.propertiesList || []) : []
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login(state, action) {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.isUserLoggedIn = true;
      state.role = action.payload.role || 'INVESTOR';
      state.propertiesList = action.payload.propertiesList || [];
    },
    logout(state) {
      state.user = null;
      state.isAuthenticated = false;
      state.isUserLoggedIn = false;
      state.role = null;
      state.propertiesList = [];
    },
  },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;
