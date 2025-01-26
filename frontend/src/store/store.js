import { configureStore } from '@reduxjs/toolkit';

import authReducer from './authSlice';

const store = configureStore({
    reducer: {
        auth: authReducer,
    },
});

store.subscribe(() => {
    localStorage.setItem('reduxState', JSON.stringify(store.getState()));
});

export default store;