import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import axiosInstance from '../utils/axios';

const initialState = {
    isAuthenticated: false,
    user: null,
    loading: false,
    error: null,
    is_admin: false
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login: (state, action) => {
            state.isAuthenticated = true;
            state.user = {
                ...action.payload,
                is_admin: action.payload.is_admin
            };
            state.error = null;
            localStorage.setItem('token', action.payload.token);
        },
        logout: (state) => {
            state.isAuthenticated = false;
            state.user = null;
            state.error = null;
            localStorage.removeItem('token');
        },
        updateUserStore: (state, action) => {
            state.isAuthenticated = true;
            state.user = {
                ...action.payload,
                is_admin: action.payload.is_admin
            };
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(checkForToken.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(checkForToken.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload) {
                    state.user = {
                        ...action.payload,
                        is_admin: action.payload.is_admin
                    };
                    state.isAuthenticated = true;
                } else {
                    state.isAuthenticated = false;
                }
            })
            .addCase(checkForToken.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
                state.isAuthenticated = false;
                state.user = null;
            });
    },
});

export const checkForToken = createAsyncThunk(
    'auth/checkForToken',
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                return null;
            }

            const response = await axiosInstance(token).get('api/account/user');
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to check token');
        }
    }
);

export const { login, logout, updateUserStore } = authSlice.actions;

export const selectAuth = (state) => state.auth;

export default authSlice.reducer;