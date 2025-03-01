import { configureStore } from '@reduxjs/toolkit'

import authReducer from './authSlice'
import cartReducer from './cartSlice'

const store = configureStore({
	reducer: {
		auth: authReducer,
		cart: cartReducer,
	},
})

store.subscribe(() => {
	localStorage.setItem('reduxState', JSON.stringify(store.getState()))
})

export default store
