import { configureStore } from "@reduxjs/toolkit";
import propertySlice from "./slices/propertySlice";
import userSlice from "./slices/userSlice";

const store = configureStore({
  reducer: {
    property: propertySlice,
    user: userSlice,
  },
});

export default store;
