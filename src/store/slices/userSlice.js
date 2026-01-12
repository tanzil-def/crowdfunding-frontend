import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: {
    name: 'Tanzil',
    email: 'tanzil@example.com',
    role: 'DEVELOPER'
  },
  isAuthenticated: true,
  isUserLoggedIn: true,
  role: 'DEVELOPER',
  propertiesList: []  // Dummy array to avoid Header errors
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
