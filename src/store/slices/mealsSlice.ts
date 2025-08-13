import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Meal } from '../../api/types';

interface MealsState {
  meals: Meal[];
  userMeals: Meal[];
  likedMeals: string[];
  filter: 'all' | 'liked';
  searchQuery: string;
  removedMeals: string[];
}

const initialState: MealsState = {
  meals: [],
  userMeals: [],
  likedMeals: [],
  filter: 'all',
  searchQuery: '',
  removedMeals: JSON.parse(localStorage.getItem('removedMeals') || '[]'),
};

const mealsSlice = createSlice({
  name: 'meals',
  initialState,
  reducers: {
    setMeals: (state, action: PayloadAction<Meal[]>) => {
      state.meals = action.payload.filter(
        meal => !state.removedMeals.includes(meal.idMeal)
      );
    },
    addUserMeal: (state, action: PayloadAction<Omit<Meal, 'idMeal'>>) => {
      const newMeal = {
        ...action.payload,
        idMeal: `user-${Date.now()}`,
      };
      state.userMeals.push(newMeal);
    },
    // Добавляем отсутствующий reducer
    updateUserMeal: (state, action: PayloadAction<Meal>) => {
      const index = state.userMeals.findIndex(meal => meal.idMeal === action.payload.idMeal);
      if (index !== -1) {
        state.userMeals[index] = action.payload;
      }
    },
    toggleLike: (state, action: PayloadAction<string>) => {
      const index = state.likedMeals.indexOf(action.payload);
      if (index === -1) {
        state.likedMeals.push(action.payload);
      } else {
        state.likedMeals.splice(index, 1);
      }
    },
    removeMeal: (state, action: PayloadAction<string>) => {
      if (!state.removedMeals.includes(action.payload)) {
        state.removedMeals.push(action.payload);
        localStorage.setItem('removedMeals', JSON.stringify(state.removedMeals));
      }
      state.likedMeals = state.likedMeals.filter(id => id !== action.payload);
    },
    restoreMeal: (state, action: PayloadAction<string>) => {
      state.removedMeals = state.removedMeals.filter(id => id !== action.payload);
      localStorage.setItem('removedMeals', JSON.stringify(state.removedMeals));
    },
    setFilter: (state, action: PayloadAction<'all' | 'liked'>) => {
      state.filter = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
  },
});

// Не забудьте добавить updateUserMeal в экспорты
export const {
  setMeals,
  addUserMeal,
  updateUserMeal, // Добавляем здесь
  toggleLike,
  removeMeal,
  restoreMeal,
  setFilter,
  setSearchQuery,
} = mealsSlice.actions;

export default mealsSlice.reducer;