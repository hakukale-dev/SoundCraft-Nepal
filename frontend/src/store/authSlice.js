import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import axios from '../utils/axios'

const initialState = {
	isAuthenticated: false,
	user: null,
	loading: true,
	error: null,
	is_admin: false,
}

const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		login: (state, action) => {
			state.isAuthenticated = true
			state.user = action.payload
			state.error = null
			state.is_admin = action.payload.is_admin
			localStorage.setItem('token', action.payload.token)
		},
		logout: (state) => {
			state.isAuthenticated = false
			state.user = null
			state.error = null
			localStorage.removeItem('token')
		},
		updateUserStore: (state, action) => {
			state.isAuthenticated = true
			state.user = action.payload
			state.error = null
			state.is_admin = action.payload.is_admin
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(checkForToken.pending, (state) => {
				state.loading = true
				state.error = null
			})
			.addCase(checkForToken.fulfilled, (state, action) => {
				state.loading = false
				if (action.payload) {
					state.user = action.payload
					state.isAuthenticated = true
					state.is_admin = action.payload.is_admin
				} else {
					state.isAuthenticated = false
				}
			})
			.addCase(checkForToken.rejected, (state, action) => {
				state.loading = false
				state.error = action.error.message
				state.isAuthenticated = false
				state.user = null
				state.is_admin = false
				localStorage.removeItem('token')
			})
	},
})

export const checkForToken = createAsyncThunk(
	'auth/checkForToken',
	async (_, { rejectWithValue }) => {
		try {
			const token = localStorage.getItem('token')
			if (!token) {
				return null
			}

			const response = await axios.get('api/auth/verify-token')
			return response.data
		} catch (error) {
			if (error.response?.status === 401) {
				localStorage.removeItem('token')
			}
			return rejectWithValue(
				error.response?.data?.error || 'Failed to check token'
			)
		}
	}
)

export const { login, logout, updateUserStore } = authSlice.actions

export const selectAuth = (state) => state.auth

export default authSlice.reducer
