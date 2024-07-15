import { configureStore } from '@reduxjs/toolkit'
import cartSliceReducer from './slices/cartSlice'
import { TypedUseSelectorHook, useSelector } from 'react-redux'

export const makeStore = configureStore({
    reducer: {
        cart: cartSliceReducer,
    },
    devTools: process.env.NODE_ENV !== 'production',
  })

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof makeStore.getState>
export type AppDispatch = typeof makeStore.dispatch

export const useAppSelector : TypedUseSelectorHook<RootState> =useSelector;