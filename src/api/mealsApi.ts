import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface Meal {
  idMeal: string;
  strMeal: string;
  strCategory: string;
  strArea: string;
  strMealThumb: string;
  strInstructions: string;
  strTags?: string;
  strYoutube?: string;
  // Динамические свойства для ингредиентов и мер
  strIngredient1?: string;
  strIngredient2?: string;
  strIngredient3?: string;
  strIngredient4?: string;
  strIngredient5?: string;
  strIngredient6?: string;
  strIngredient7?: string;
  strIngredient8?: string;
  strIngredient9?: string;
  strIngredient10?: string;
  strIngredient11?: string;
  strIngredient12?: string;
  strIngredient13?: string;
  strIngredient14?: string;
  strIngredient15?: string;
  strIngredient16?: string;
  strIngredient17?: string;
  strIngredient18?: string;
  strIngredient19?: string;
  strIngredient20?: string;
  strMeasure1?: string;
  strMeasure2?: string;
  strMeasure3?: string;
  strMeasure4?: string;
  strMeasure5?: string;
  strMeasure6?: string;
  strMeasure7?: string;
  strMeasure8?: string;
  strMeasure9?: string;
  strMeasure10?: string;
  strMeasure11?: string;
  strMeasure12?: string;
  strMeasure13?: string;
  strMeasure14?: string;
  strMeasure15?: string;
  strMeasure16?: string;
  strMeasure17?: string;
  strMeasure18?: string;
  strMeasure19?: string;
  strMeasure20?: string;
}

export interface Category {
  idCategory: string;
  strCategory: string;
  strCategoryThumb: string;
  strCategoryDescription: string;
}

export const mealsApi = createApi({
  reducerPath: "mealsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://www.themealdb.com/api/json/v1/1/",
  }),
  endpoints: (builder) => ({
    getPopularMeals: builder.query<Meal[], void>({
      query: () => "search.php?s=",
      transformResponse: (response: { meals: Meal[] | null }) =>
        response.meals || [],
    }),
    getMealById: builder.query<Meal, string>({
      query: (id) => `lookup.php?i=${id}`,
      transformResponse: (response: { meals: Meal[] }) => response.meals[0],
    }),
    searchMeals: builder.query<Meal[], string>({
      query: (query) => `search.php?s=${query}`,
      transformResponse: (response: { meals: Meal[] | null }) =>
        response.meals || [],
    }),
    getCategories: builder.query<Category[], void>({
      query: () => "categories.php",
      transformResponse: (response: { categories: Category[] | null }) =>
        response.categories || [],
    }),
    getMealsByCategory: builder.query<Meal[], string>({
      query: (category) => `filter.php?c=${category}`,
      transformResponse: (response: { meals: Meal[] | null }) =>
        response.meals || [],
    }),
    getMealsByArea: builder.query<Meal[], string>({
      query: (area) => `filter.php?a=${area}`,
      transformResponse: (response: { meals: Meal[] | null }) =>
        response.meals || [],
    }),
  }),
});

export const {
  useGetPopularMealsQuery,
  useGetMealByIdQuery,
  useSearchMealsQuery,
  useGetCategoriesQuery,
  useGetMealsByCategoryQuery,
  useGetMealsByAreaQuery,
} = mealsApi;
