import { ProductsTable } from "@/app/lib/definitions";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";


interface CartState {
    id: number;
    product: ProductsTable;
    quantity: number;
}

const initialState: CartState[] = [];

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        updateCart: (state, action: PayloadAction<CartState[]>)=> {
            return action.payload
        }
    },
});

// export const { addToCart, updateCart, removeFromCart, hideLoading } = cartSlice.actions;
export const { updateCart } = cartSlice.actions;


export default cartSlice.reducer;