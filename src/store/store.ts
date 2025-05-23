import { configureStore } from "@reduxjs/toolkit"
import authReducer from "./slices/authSlice"
import itemsReducer from "./slices/itemsSlice"
import otherCostsReducer from "./slices/otherCostSlice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    items: itemsReducer,
    otherCosts: otherCostsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
