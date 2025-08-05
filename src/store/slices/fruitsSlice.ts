import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { FruitType } from '../../api/types';

interface FruitsState {
  fruits: FruitType[];
  userFruits: FruitType[];
  likedFruits: number[];
  filter: 'all' | 'liked';
  searchQuery: string;
}

const initialState: FruitsState = {
  fruits: [],
  userFruits: [],
  likedFruits: [],
  filter: 'all',
  searchQuery: '',
};

const fruitsSlice = createSlice({
  name: 'fruits',
  initialState,
  reducers: {
    setFruits: (state, action: PayloadAction<FruitType[]>) => {
      state.fruits = action.payload;
    },
    addUserFruit: (state, action: PayloadAction<FruitType>) => {
      const newId = action.payload.id || Math.max(0, ...state.userFruits.map(f => Number(f.id))) + 1;
      state.userFruits.push({
        ...action.payload,
        id: newId,
        isUserCreated: true
      });
    },
    updateUserFruit: (state, action: PayloadAction<FruitType>) => {
      const index = state.userFruits.findIndex(f => f.id === action.payload.id);
      if (index !== -1) {
        state.userFruits[index] = action.payload;
      }
    },
    toggleLike: (state, action: PayloadAction<number>) => {
      const index = state.likedFruits.indexOf(action.payload);
      if (index === -1) {
        state.likedFruits.push(action.payload);
      } else {
        state.likedFruits.splice(index, 1);
      }
    },
    removeFruit: (state, action: PayloadAction<number>) => {
      state.fruits = state.fruits.filter(fruit => fruit.id !== action.payload);
      state.userFruits = state.userFruits.filter(fruit => fruit.id !== action.payload);
      state.likedFruits = state.likedFruits.filter(id => id !== action.payload);
    },
    setFilter: (state, action: PayloadAction<'all' | 'liked'>) => {
      state.filter = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
  },
});

export const {
  setFruits,
  addUserFruit,
  updateUserFruit,
  toggleLike,
  removeFruit,
  setFilter,
  setSearchQuery,
} = fruitsSlice.actions;

export default fruitsSlice.reducer;
