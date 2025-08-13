import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { mealsApi } from '../api/mealsApi';
import mealsReducer from './slices/mealsSlice';
import type { TypedUseSelectorHook } from 'react-redux';
import { useDispatch, useSelector } from 'react-redux';

export const store = configureStore({
  reducer: {
    [mealsApi.reducerPath]: mealsApi.reducer,
    meals: mealsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(mealsApi.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;