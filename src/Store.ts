import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./slices/Api.slice";
import { apiPrivateSlice } from "./slices/ApiPrivate.slice";
import cartReducer from "./slices/Cart.slice";
import authReducer from "./slices/AuthToken.slice";

export const Store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    [apiPrivateSlice.reducerPath]: apiPrivateSlice.reducer,
    cart: cartReducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      apiSlice.middleware,
      apiPrivateSlice.middleware
    ),
});

export type RootState = ReturnType<typeof Store.getState>;
export type AppDispatch = typeof Store.dispatch;
