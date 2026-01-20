import { createSlice } from '@reduxjs/toolkit';

const adminSlice = createSlice({
    name: 'admin',
    initialState: {
        dashboard: null,
        pendingProjects: [],
        pendingProjectsCount: 0,
        accessRequests: [],
        auditLogs: [],
        payments: [],
        loading: false,
    },
    reducers: {
        setDashboard: (state, action) => {
            state.dashboard = action.payload;
        },
        setPendingProjects: (state, action) => {
            state.pendingProjects = action.payload;
        },
        setPendingProjectsCount: (state, action) => {
            state.pendingProjectsCount = action.payload;
        },
        setAccessRequests: (state, action) => {
            state.accessRequests = action.payload;
        },
        setAuditLogs: (state, action) => {
            state.auditLogs = action.payload;
        },
        setPayments: (state, action) => {
            state.payments = action.payload;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
    },
});

export const {
    setDashboard,
    setPendingProjects,
    setPendingProjectsCount,
    setAccessRequests,
    setAuditLogs,
    setPayments,
    setLoading,
} = adminSlice.actions;

export default adminSlice.reducer;
