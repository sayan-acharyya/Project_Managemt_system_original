import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import popupReducer from "./slices/popupSlice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        popup: popupReducer,
    },
});
