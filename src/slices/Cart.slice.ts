import { createSlice } from "@reduxjs/toolkit";

let cartItems: any[] = [];

type cartState = {
  products: any[];
  totalItem: number;
  totalPrice: number;
};

const initialCartState = {
  products: cartItems,
  totalItem: 0,
  totalPrice: 0,
} as cartState;

const deleteItems = (dataState: any, dataAction: any) => {
  dataState.totalItem -= dataAction.payload.amount;
  dataState.totalPrice -= dataAction.payload.price;
  dataState.products = dataState.products.filter(
    (item: any) => item.sku !== dataAction.payload.sku
  );
};

export const cartSlice = createSlice({
  name: "cart",
  initialState: initialCartState,
  reducers: {
    addItem: (state: any, action: any) => {
      const existingItem = state.products.find(
        (item: any) => item.sku === action.payload.sku
      );
      if (!existingItem) {
        state.products.push(action.payload);
        state.totalPrice += action.payload.price;
      } else {
        if (existingItem.amount !== action.payload.maxItem) {
          existingItem.amount++;
          existingItem.price += action.payload.price;
          state.totalPrice += action.payload.price;
        }
      }
      state.totalItem++;
    },
    sliceItem: (state: any, action: any) => {
      const existingItem = state.products.find(
        (item: any) => item.sku === action.payload.sku
      );
      if (existingItem) {
        if (existingItem.amount > 1) {
          state.totalPrice =
            state.totalPrice - action.payload.price / existingItem.amount;
          existingItem.price =
            existingItem.price - action.payload.price / existingItem.amount;
          existingItem.amount--;
          state.totalItem--;
        } else {
          deleteItems(state, action);
        }
      }
    },
    removeItem: (state: any, action: any) => {
      deleteItems(state, action);
    },
    clearItems: (state: any) => {
        state.products = [];
        state.totalItem = 0;
        state.totalPrice = 0;
    }
  },
});

export const { addItem, sliceItem, removeItem, clearItems } = cartSlice.actions;

export default cartSlice.reducer;
