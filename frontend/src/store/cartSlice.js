import { createSelector, createSlice } from '@reduxjs/toolkit'

const initialState = {
	itemsByUser:
		JSON.parse(localStorage.getItem('reduxState'))?.cart?.itemsByUser || {},
}

const cartSlice = createSlice({
	name: 'cart',
	initialState,
	reducers: {
		setCartFromLocalStorage: (state, action) => {
			state.itemsByUser = action.payload
		},
		addToCart: (state, action) => {
			const { userId, product } = action.payload
			if (!userId) return

			if (!state.itemsByUser[userId]) {
				state.itemsByUser[userId] = []
			}

			const userCart = state.itemsByUser[userId]
			const existingItem = userCart.find(
				(item) => item._id === product._id
			)

			if (existingItem) {
				existingItem.qty += 1
			} else {
				userCart.push({ ...product, qty: 1 })
			}
		},
		removeFromCart: (state, action) => {
			const { userId, productId } = action.payload
			if (!userId) return

			state.itemsByUser[userId] =
				state.itemsByUser[userId]?.filter(
					(item) => item._id !== productId
				) || []
		},
		increaseQty: (state, action) => {
			const { userId, productId } = action.payload
			if (!userId) return

			const item = state.itemsByUser[userId]?.find(
				(item) => item._id === productId
			)
			if (item) item.qty += 1
		},
		decreaseQty: (state, action) => {
			const { userId, productId } = action.payload
			if (!userId) return

			const item = state.itemsByUser[userId]?.find(
				(item) => item._id === productId
			)
			if (item && item.qty > 1) item.qty -= 1
		},
		clearCart: (state, action) => {
			const userId = action.payload
			if (!userId) return

			state.itemsByUser[userId] = []
		},
	},
})

export const {
	setCartFromLocalStorage,
	addToCart,
	removeFromCart,
	increaseQty,
	decreaseQty,
	clearCart,
} = cartSlice.actions

// Selectors
const selectItemsByUser = (state, userId) => {
	return state.cart.itemsByUser[userId] || []
}

export const selectCartDetails = createSelector(
	[selectItemsByUser],
	(items) => {
		const totalPrice = items.reduce(
			(sum, item) => sum + item.price * item.qty,
			0
		)
		return { items, totalPrice }
	}
)

export const selectCanAddToCart = createSelector(
	[
		selectItemsByUser,
		(_, userId, productId, quantity) => ({ userId, productId, quantity }),
	],
	(items, { productId, quantity }) => {
		const item = items.find((item) => item._id === productId)
		if (!item) return true
		return item.qty + quantity <= item.stock
	}
)

export default cartSlice.reducer
