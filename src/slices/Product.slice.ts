import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { v4 as uuid } from "uuid";

import { apiPrivateSlice } from "./ApiPrivate.slice";
import { ResponseTag } from "../ResponseTag";
import { Product } from "../types/product/Product.type";

const productsAdapter = createEntityAdapter();

const initialState = productsAdapter.getInitialState();

export const productsApiSlice: any = apiPrivateSlice.injectEndpoints({
  endpoints: (builder: any) => ({
    getProducts: builder.query({
      query: () => "/660/products?_sort=sku&_order=asc",
      transformResponse: (responseData: any) => {
        return productsAdapter.setAll(initialState, responseData);
      },
      providesTags: (result: any, error: any, arg: any) =>
        ResponseTag(result, error, "Product"),
    }),
    addProduct: builder.mutation({
      query: (dataProduct: any) => ({
        url: "/660/products",
        method: "POST",
        body: {
          id: uuid(),
          ...dataProduct,
        },
      }),
      invalidatesTags: [{ type: "Product", id: "LIST" }],
    }),
    updateProduct: builder.mutation({
      query: (dataProduct: any) => ({
        url: `/660/products/${dataProduct.id}`,
        method: "PATCH",
        body: {
          ...dataProduct,
        },
      }),
      invalidatesTags: (result: any, error: any, arg: any) => [
        { type: "Product", id: arg.id },
      ],
    }),
    deleteProduct: builder.mutation({
      query: (id: string) => ({
        url: `/660/products/${id}`,
        method: "DELETE",
        body: { id },
      }),
      invalidatesTags: (result: any, error: any, arg: any) => [
        { type: "Product", id: arg.id },
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

export const {
  useGetProductsQuery,
  useAddProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productsApiSlice;
