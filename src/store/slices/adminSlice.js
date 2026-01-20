import { createSlice } from "@reduxjs/toolkit";

const adminSlice = createSlice({
    name: "admin",
    initialState: {
        pendingProjectsCount: 0,
        pendingAccessRequestsCount: 0,
        dashboardSummary: null,
        loading: false,
        error: null,
    },
    reducers: {
        setPendingProjectsCount: (state, action) => {
            state.pendingProjectsCount = action.payload;
        },
        setPendingAccessRequestsCount: (state, action) => {
            state.pendingAccessRequestsCount = action.payload;
        },
        setDashboardSummary: (state, action) => {
            state.dashboardSummary = action.payload;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
    },
});

export const {
    setPendingProjectsCount,
    setPendingAccessRequestsCount,
    setDashboardSummary,
    setLoading,
    setError,
} = adminSlice.actions;

export default adminSlice.reducer;
