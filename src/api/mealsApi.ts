import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

interface Meal {
  idMeal: string;
  strMeal: string;
  strCategory: string;
  strArea: string;
  strMealThumb: string;
  strInstructions: string;
  strTags?: string;
  strYoutube?: string;
}

export const mealsApi = createApi({
  reducerPath: 'mealsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://www.themealdb.com/api/json/v1/1/',
  }),
  endpoints: (builder) => ({
    getPopularMeals: builder.query<Meal[], void>({
      query: () => 'search.php?s=',
      transformResponse: (response: { meals: Meal[] | null }) => response.meals || [],
    }),
    getMealById: builder.query<Meal, string>({
      query: (id) => `lookup.php?i=${id}`,
      transformResponse: (response: { meals: Meal[] }) => response.meals[0],
    }),
    searchMeals: builder.query<Meal[], string>({
      query: (query) => `search.php?s=${query}`,
      transformResponse: (response: { meals: Meal[] | null }) => response.meals || [],
    }),
  }),
});

export const {
  useGetPopularMealsQuery,
  useGetMealByIdQuery,
  useSearchMealsQuery
} = mealsApi;