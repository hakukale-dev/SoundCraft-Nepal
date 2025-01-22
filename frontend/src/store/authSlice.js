import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import axiosInstance from '../utils/axios';

const initialState = {
    isAuthenticated: false,
    user: null,
    loading: null,
};

const authSlice = createSlice( {
    name: 'auth',
    initialState,
    reducers: {
        login: ( state, action ) =>
        {
            state.isAuthenticated = true;
            state.user = action.payload;
            localStorage.setItem( 'token', action.payload.token );
        },
        logout: ( state ) =>
        {
            state.isAuthenticated = null;
            state.user = null;
            localStorage.removeItem( 'token' );
        },
        updateUserStore: ( state, action ) =>
        {
            state.isAuthenticated = true;
            state.user = action.payload;
        },
    },
    extraReducers: ( builder ) =>
    {
        builder.addCase( checkForToken.fulfilled, ( state, action ) =>
        {
            state.loading = false;

            if ( action.payload )
            {
                state.user = action.payload;
                state.isAuthenticated = true;
            }
        } );
    },
} );

export const checkForToken = createAsyncThunk( 'auth/checkForToken', async () =>
{
    try
    {
        const token = localStorage.getItem( 'token' );
        if ( token )
        {
            const data = await axiosInstance( token )
                .get( 'api/account/user' )
                .then( ( res ) => res.data )
                .catch( () => null );
            console.log( data );
            return data;
        }

        return null;
    } catch ( error )
    {
        return error;
    }
} );

export const { login, logout } = authSlice.actions;

export const selectAuth = ( state ) => state.auth;

export default authSlice.reducer;