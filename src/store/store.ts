import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { fruitsApi } from '../api/fruitsApi';
import fruitsReducer from './slices/fruitsSlice';
import type { TypedUseSelectorHook } from 'react-redux';
import { useDispatch, useSelector } from 'react-redux';

export const store = configureStore({
  reducer: {
    [fruitsApi.reducerPath]: fruitsApi.reducer,
    fruits: fruitsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(fruitsApi.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
