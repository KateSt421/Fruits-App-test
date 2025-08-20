import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Meal } from "../../api/types";

interface MealsState {
  meals: Meal[];
  userMeals: Meal[];
  likedMeals: string[];
  filter: "all" | "liked";
  searchQuery: string;
  removedMeals: string[];
  editedMeals: Meal[];
  categoryFilter: string;
  areaFilter: string;
}

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
  categoryFilter: "all",
  areaFilter: "all",
};

const mealsSlice = createSlice({
  name: "meals",
  initialState,
  reducers: {
    setMeals: (state, action: PayloadAction<Meal[]>) => {
      const apiMeals = action.payload.filter(
        (meal) => !state.removedMeals.includes(meal.idMeal)
      );

      state.meals = apiMeals.map((apiMeal) => {
        const editedMeal = state.editedMeals.find(
          (edited) => edited.idMeal === apiMeal.idMeal
        );
        return editedMeal || apiMeal;
      });
    },

    setCategoryFilter: (state, action: PayloadAction<string>) => {
      state.categoryFilter = action.payload;
    },

    setAreaFilter: (state, action: PayloadAction<string>) => {
      state.areaFilter = action.payload;
    },

    addUserMeal: (state, action: PayloadAction<Omit<Meal, "idMeal">>) => {
      const newMeal = {
        ...action.payload,
        idMeal: `user-${Date.now()}`,
      };
      state.userMeals.push(newMeal);
      localStorage.setItem("userMeals", JSON.stringify(state.userMeals));
    },

    updateMeal: (state, action: PayloadAction<Meal>) => {
      const meal = action.payload;

      if (meal.idMeal.startsWith("user-")) {
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
        const existingIndex = state.editedMeals.findIndex(
          (m) => m.idMeal === meal.idMeal
        );
        if (existingIndex !== -1) {
          state.editedMeals[existingIndex] = meal;
        } else {
          state.editedMeals.push(meal);
        }

        const mealIndex = state.meals.findIndex(
          (m) => m.idMeal === meal.idMeal
        );
        if (mealIndex !== -1) {
          state.meals[mealIndex] = meal;
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

      state.editedMeals = state.editedMeals.filter(
        (meal) => meal.idMeal !== action.payload
      );
      localStorage.setItem("editedMeals", JSON.stringify(state.editedMeals));

      state.meals = state.meals.filter(
        (meal) => meal.idMeal !== action.payload
      );
      state.userMeals = state.userMeals.filter(
        (meal) => meal.idMeal !== action.payload
      );
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

    clearAllFilters: (state) => {
      state.categoryFilter = "all";
      state.areaFilter = "all";
      state.searchQuery = "";
      state.filter = "all";
    },
  },
});

export const {
  setMeals,
  setCategoryFilter,
  setAreaFilter,
  addUserMeal,
  updateMeal,
  toggleLike,
  removeMeal,
  restoreMeal,
  setFilter,
  setSearchQuery,
  clearAllFilters,
} = mealsSlice.actions;

export default mealsSlice.reducer;