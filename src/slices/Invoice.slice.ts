import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { v4 as uuid } from "uuid";

import { apiPrivateSlice } from "./ApiPrivate.slice";
import { ResponseTag } from "../ResponseTag";

const invoicesAdapter = createEntityAdapter();

const initialState = invoicesAdapter.getInitialState();

export const invoicesApiSlice: any = apiPrivateSlice.injectEndpoints({
  endpoints: (builder: any) => ({
    getInvoices: builder.query({
      query: () => "/660/invoices",
      transformResponse: (responseData: any) => {
        return invoicesAdapter.setAll(initialState, responseData);
      },
      providesTags: (result: any, error: any, arg: any) =>
        ResponseTag(result, error, "Invoice"),
    }),
    createInvoice: builder.mutation({
      query: (cartItems: any) => ({
        url: "/660/invoices",
        method: "POST",
        body: {
          id: uuid(),
          ...cartItems,
          paid: parseFloat(cartItems.paid),
          createdAt: new Date(),
        },
      }),
      invalidatesTags: [{ type: "Invoice", id: "LIST" }],
    }),
  }),
});

export const selectInvoicesResult = invoicesApiSlice.endpoints.getInvoices.select();

const selectInvoicesData = createSelector(
  selectInvoicesResult,
  (InvoicesResult) => InvoicesResult.data
);

export const {
  selectAll: selectAllInvoices,
  selectById: selectInvoiceById,
  selectIds: selectInvoiceIds,
} = invoicesAdapter.getSelectors(
  (state: any) => selectInvoicesData(state) ?? initialState
);

export const { useCreateInvoiceMutation, useGetInvoicesQuery } = invoicesApiSlice;
