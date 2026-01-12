import { createSlice } from '@reduxjs/toolkit';

const propertySlice = createSlice({
  name: 'property',
  initialState: {
    properties: [],
    loading: false,
  },
  reducers: {
    setProperties: (state, action) => {
      state.properties = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { setProperties, setLoading } = propertySlice.actions;
export default propertySlice.reducer;
