
import { configureStore } from "@reduxjs/toolkit";
import propertySlice from "./slices/propertySlice";
import userSlice from "./slices/userSlice";
import adminSlice from "./slices/adminSlice";
import notificationSlice from "./slices/notificationSlice";

const store = configureStore({
  reducer: {
    property: propertySlice,
    user: userSlice,
    admin: adminSlice,
    notifications: notificationSlice,
  },
});

export default store;
