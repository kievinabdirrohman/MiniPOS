import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { v4 as uuid } from "uuid";

import { apiPrivateSlice } from "./ApiPrivate.slice";
import { ResponseTag } from "../ResponseTag";

const customersAdapter = createEntityAdapter();

const initialState = customersAdapter.getInitialState();

export const customersApiSlice: any = apiPrivateSlice.injectEndpoints({
  endpoints: (builder: any) => ({
    getCustomers: builder.query({
      query: () => "/customers",
      transformResponse: (responseData: any) => {
        return customersAdapter.setAll(initialState, responseData);
      },
      providesTags: (result: any, error: any, arg: any) =>
        ResponseTag(result, error, "Customer"),
    }),
    addCustomer: builder.mutation({
      query: (dataCustomer: any) => ({
        url: "/customers",
        method: "POST",
        body: {
          id: uuid(),
          ...dataCustomer,
        },
      }),
      invalidatesTags: [{ type: "Customer", id: "LIST" }],
    }),
    updateCustomer: builder.mutation({
      query: (dataCustomer: any) => ({
        url: `/customers/${dataCustomer.id}`,
        method: "PATCH",
        body: {
          ...dataCustomer,
        },
      }),
      invalidatesTags: (result: any, error: any, arg: any) => [
        { type: "Customer", id: arg.id },
      ],
    }),
    deleteCustomer: builder.mutation({
      query: (id: string) => ({
        url: `/customers/${id}`,
        method: "DELETE",
        body: { id },
      }),
      invalidatesTags: (result: any, error: any, arg: any) => [
        { type: "Customer", id: arg.id },
      ],
    }),
  }),
});

export const selectCustomersResult =
  customersApiSlice.endpoints.getCustomers.select();

const selectCustomersData = createSelector(
  selectCustomersResult,
  (customersResult) => customersResult.data
);

export const {
  selectAll: selectAllCustomers,
  selectById: selectCustomerById,
  selectIds: selectCustomerIds,
} = customersAdapter.getSelectors(
  (state: any) => selectCustomersData(state) ?? initialState
);

export const {
  useGetCustomersQuery,
  useAddCustomerMutation,
  useUpdateCustomerMutation,
  useDeleteCustomerMutation,
} = customersApiSlice;
