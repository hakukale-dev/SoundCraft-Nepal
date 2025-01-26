import { createSlice } from '@reduxjs/toolkit';

const initialState = [];

const CartSlice = createSlice( {
    name: 'cart',
    initialState,
    reducers: {
        setCartFromLocalStorage: ( state, action ) => action.payload,
        addToCart: ( state, action ) => [
            ...state,
            {
                id: action.payload.equipment_id,
                name: action.payload.name,
                thumbnail: action.payload.thumbnail,
                qty: 1,
                price_per: action.payload.price_per,
            },
        ],
        removeFromCart: ( state, action ) =>
            state.filter( ( equipment ) => action.payload !== equipment.id ),
        increaseQty: ( state, action ) =>
            state.map( ( equipment ) =>
                equipment.id === action.payload
                    ? { ...equipment, qty: equipment.qty + 1 }
                    : equipment
            ),
        decreaseQty: ( state, action ) =>
            state.map( ( equipment ) =>
                equipment.id === action.payload
                    ? { ...equipment, qty: equipment.qty - 1 }
                    : equipment
            ),
        clearCart: ( state, action ) => [],
    },
} );

export const {
    setCartFromLocalStorage,
    checkoutCart,
    addToCart,
    removeFromCart,
    increaseQty,
    decreaseQty,
    clearCart,
} = CartSlice.actions;

export default CartSlice.reducer;
