import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./slices/Api.slice";
import cartReducer from "./slices/Cart.slice";

export const Store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    cart: cartReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});

export type RootState = ReturnType<typeof Store.getState>;
export type AppDispatch = typeof Store.dispatch;