import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";

import { apiSlice } from "./Api.slice";
import { Product } from "../types/product/Product.type";

const productsAdapter = createEntityAdapter();

const initialState = productsAdapter.getInitialState();

export const productsApiSlice: any = apiSlice.injectEndpoints({
  endpoints: (builder: any) => ({
    getProducts: builder.query({
      query: () => "/products",
      transformResponse: (responseData: any) => {
        return productsAdapter.setAll(initialState, responseData);
      },
      providesTags: (result: any, error: any, arg: any) => [
        { type: "Product", id: "LIST" },
        ...result.ids.map((id: any) => ({ type: "Product", id })),
      ],
    }),
  }),
});

export const selectProductsResult =
  productsApiSlice.endpoints.getProducts.select();

const selectProductsData = createSelector(
  selectProductsResult,
  (productsResult) => productsResult.data
);

export const {
  selectAll: selectAllProducts,
  selectById: selectProductById,
  selectIds: selectProductIds,
} = productsAdapter.getSelectors(
  (state: any) => selectProductsData(state) ?? initialState
);

export const { useGetProductsQuery } = productsApiSlice;
