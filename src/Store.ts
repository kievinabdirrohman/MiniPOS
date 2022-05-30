import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./slices/Api.slice";

export const Store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});
