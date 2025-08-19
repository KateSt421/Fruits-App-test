import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Meal } from "../../api/types";

interface MealsState {
  meals: Meal[];
  userMeals: Meal[];
  likedMeals: string[];
  filter: "all" | "liked";
  searchQuery: string;
  removedMeals: string[];
  editedMeals: Meal[]; // Добавляем для хранения отредактированных API блюд
}

// Функция для загрузки из localStorage
const loadFromLocalStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
};

const initialState: MealsState = {
  meals: [],
  userMeals: loadFromLocalStorage<Meal[]>("userMeals", []),
  likedMeals: loadFromLocalStorage<string[]>("likedMeals", []),
  filter: "all",
  searchQuery: "",
  removedMeals: loadFromLocalStorage<string[]>("removedMeals", []),
  editedMeals: loadFromLocalStorage<Meal[]>("editedMeals", []),
};

const mealsSlice = createSlice({
  name: "meals",
  initialState,
  reducers: {
    setMeals: (state, action: PayloadAction<Meal[]>) => {
      state.meals = action.payload.filter(
        (meal) => !state.removedMeals.includes(meal.idMeal)
      );
    },

    addUserMeal: (state, action: PayloadAction<Omit<Meal, "idMeal">>) => {
      const newMeal = {
        ...action.payload,
        idMeal: `user-${Date.now()}`,
      };
      state.userMeals.push(newMeal);
      localStorage.setItem("userMeals", JSON.stringify(state.userMeals));
    },

    updateUserMeal: (state, action: PayloadAction<Meal>) => {
      const index = state.userMeals.findIndex(
        (meal) => meal.idMeal === action.payload.idMeal
      );
      if (index !== -1) {
        state.userMeals[index] = action.payload;
        localStorage.setItem("userMeals", JSON.stringify(state.userMeals));
      }
    },

    // Новый reducer для редактирования API блюд
    // mealsSlice.ts - обновим updateMeal reducer
    updateMeal: (state, action: PayloadAction<Meal>) => {
      const meal = action.payload;

      if (meal.idMeal.startsWith("user-")) {
        // Если это пользовательское блюдо - обновляем в userMeals
        const index = state.userMeals.findIndex(
          (m) => m.idMeal === meal.idMeal
        );
        if (index !== -1) {
          state.userMeals[index] = meal;
        } else {
          state.userMeals.push(meal);
        }
        localStorage.setItem("userMeals", JSON.stringify(state.userMeals));
      } else {
        // Если это API блюдо - сохраняем в editedMeals
        const existingIndex = state.editedMeals.findIndex(
          (m) => m.idMeal === meal.idMeal
        );
        if (existingIndex !== -1) {
          state.editedMeals[existingIndex] = meal;
        } else {
          state.editedMeals.push(meal);
        }
        localStorage.setItem("editedMeals", JSON.stringify(state.editedMeals));
      }
    },

    toggleLike: (state, action: PayloadAction<string>) => {
      const index = state.likedMeals.indexOf(action.payload);
      if (index === -1) {
        state.likedMeals.push(action.payload);
      } else {
        state.likedMeals.splice(index, 1);
      }
      localStorage.setItem("likedMeals", JSON.stringify(state.likedMeals));
    },

    removeMeal: (state, action: PayloadAction<string>) => {
      if (!state.removedMeals.includes(action.payload)) {
        state.removedMeals.push(action.payload);
        localStorage.setItem(
          "removedMeals",
          JSON.stringify(state.removedMeals)
        );
      }
      state.likedMeals = state.likedMeals.filter((id) => id !== action.payload);
      localStorage.setItem("likedMeals", JSON.stringify(state.likedMeals));
    },

    restoreMeal: (state, action: PayloadAction<string>) => {
      state.removedMeals = state.removedMeals.filter(
        (id) => id !== action.payload
      );
      localStorage.setItem("removedMeals", JSON.stringify(state.removedMeals));
    },

    setFilter: (state, action: PayloadAction<"all" | "liked">) => {
      state.filter = action.payload;
    },

    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
  },
});

export const {
  setMeals,
  addUserMeal,
  updateUserMeal,
  updateMeal, // Экспортируем новый action
  toggleLike,
  removeMeal,
  restoreMeal,
  setFilter,
  setSearchQuery,
} = mealsSlice.actions;

export default mealsSlice.reducer;
