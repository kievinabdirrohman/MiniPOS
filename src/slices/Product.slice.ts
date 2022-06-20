import { apiSlice } from "./Api.slice";
import { Product } from "../types/product/Product.type";

export const productsApiSlice: any = apiSlice.injectEndpoints({
  endpoints: (builder: any) => ({
    getProducts: builder.query({
      query: () => "/products",
        providesTags: ["Product"],
    }),
  }),
});

export const { useGetProductsQuery } = productsApiSlice;
