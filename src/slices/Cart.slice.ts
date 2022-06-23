import { createSlice } from "@reduxjs/toolkit";

let cartItems: any[] = [];

type cartState = {
    products: any[],
    totalItem: number
}

const initialCartState = {
    products: cartItems,
    totalItem: 0,
} as cartState

export const cartSlice = createSlice({
    name: 'cart',
    initialState: initialCartState,
    reducers: {
        addItem(state, action) {
            const existingItem = state.products.find((item: any) => item.sku === action.payload.sku);
            if (!existingItem) {
                state.products.push(action.payload);
            } else {
                existingItem.amount++;
                existingItem.price = existingItem.price + action.payload.price;
            }
        }
    },
})

export const { addItem } = cartSlice.actions;

export default cartSlice.reducer;