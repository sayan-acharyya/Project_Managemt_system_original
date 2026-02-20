import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import popupReducer from "./slices/popupSlice";
import adminReducer from "./slices/adminSlice";
import studentReducer from "./slices/studentSlice"
import noticationReducer from"./slices/notificationSlice"
export const store = configureStore({
    reducer: {
        auth: authReducer,
        popup: popupReducer,
        admin: adminReducer,
        student: studentReducer,
        // deadline: deadlineReducer,
         notification: noticationReducer,
        // project: projectReducer,
        // request: requestReducer,
        // teacher: teacherReducer,
    },
});
