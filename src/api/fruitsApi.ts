import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Fruit } from './types';

export const fruitsApi = createApi({
  reducerPath: 'fruitsApi',

  baseQuery: fetchBaseQuery({
    baseUrl: '/api',
  }),
  endpoints: (builder) => ({
    getAllFruits: builder.query<Fruit[], void>({
      query: () => '/fruit/all',
      transformResponse: (response: Fruit[]) => {
        return response.map(fruit => ({
          ...fruit,
          id: fruit.id,
          isUserCreated: false
        }));
      }
    }),
    getFruitById: builder.query<Fruit, number>({
      query: (id) => `fruit/${id}`,
    }),
  }),
});

export const { useGetAllFruitsQuery, useGetFruitByIdQuery } = fruitsApi;

