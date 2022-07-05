import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../Store";

export const apiPrivateSlice = createApi({
  reducerPath: "apiPrivate",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:1234",
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set(
          "authorization",
          `Bearer ${token}`
        );
      }
      return headers;
    },
  }),
  tagTypes: ["Product", "Invoice", "Customer"],
  endpoints: (builder) => ({}),
});
