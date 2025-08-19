import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "./store";

export const selectAllMeals = createSelector(
  [
    (state: RootState) => state.meals.meals,
    (state: RootState) => state.meals.userMeals,
    (state: RootState) => state.meals.editedMeals,
  ],
  (meals, userMeals, editedMeals) => {
    const allMeals = [...meals, ...userMeals];
    const editedMealsMap = new Map(
      editedMeals.map((meal) => [meal.idMeal, meal])
    );

    return allMeals.map((meal) => editedMealsMap.get(meal.idMeal) || meal);
  }
);
