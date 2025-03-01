import { createSlice } from '@reduxjs/toolkit'

const initialState = JSON.parse(localStorage.getItem('reduxState'))?.cart || []
const cartSlice = createSlice({
	name: 'cart',
	initialState,
	reducers: {
		setCartFromLocalStorage: (state, action) => console.log(action),
		addToCart: (state, action) => {
			const existingItem = state.find(
				(item) => item.id === action.payload.equipment_id
			)
			if (existingItem) {
				return state.map((item) =>
					item.id === action.payload.equipment_id
						? { ...item, qty: item.qty + 1 }
						: item
				)
			}
			return [
				...state,
				{
					id: action.payload.equipment_id,
					name: action.payload.name,
					thumbnail: action.payload.thumbnail,
					qty: 1,
					price_per: action.payload.price_per,
				},
			]
		},
		removeFromCart: (state, action) =>
			state.filter((equipment) => action.payload !== equipment.id),
		increaseQty: (state, action) =>
			state.map((equipment) =>
				equipment.id === action.payload
					? { ...equipment, qty: equipment.qty + 1 }
					: equipment
			),
		decreaseQty: (state, action) =>
			state.map((equipment) =>
				equipment.id === action.payload
					? { ...equipment, qty: equipment.qty - 1 }
					: equipment
			),
		clearCart: () => [],
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

export default cartSlice.reducer
