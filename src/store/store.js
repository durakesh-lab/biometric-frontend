import { configureStore } from '@reduxjs/toolkit';
import authReducer, { userSliceReducer } from './authSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    users:userSliceReducer
  }
});

export default store;