import { createSlice } from "@reduxjs/toolkit";

let cartItems: any[] = [];

type cartState = {
  products: any[];
  totalItem: number;
  totalPrice: number;
  totalProfit: number;
};

const initialCartState = {
  products: cartItems,
  totalItem: 0,
  totalPrice: 0,
  totalProfit: 0,
} as cartState;

const deleteItems = (dataState: any, dataAction: any) => {
  dataState.totalPrice -= dataAction.payload.price;
  dataState.totalProfit -= dataAction.payload.profit;
  dataState.totalItem -= dataAction.payload.amount;
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
        state.totalProfit += action.payload.profit;
      } else {
        if (existingItem.amount !== action.payload.maxItem) {
          existingItem.amount++;
          existingItem.price += action.payload.price;
          existingItem.profit += action.payload.profit;
          state.totalPrice += action.payload.price;
          state.totalProfit += action.payload.profit;
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
          state.totalProfit =
            state.totalProfit - action.payload.profit / existingItem.amount;
          existingItem.price =
            existingItem.price - action.payload.price / existingItem.amount;
          existingItem.profit =
            existingItem.profit - action.payload.profit / existingItem.amount;
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
      state.totalProfit = 0;
    },
  },
});

export const { addItem, sliceItem, removeItem, clearItems } = cartSlice.actions;

export default cartSlice.reducer;
