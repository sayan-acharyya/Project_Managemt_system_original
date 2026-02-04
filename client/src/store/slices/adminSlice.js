import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios";
import { toast } from "react-toastify";

export const createSudent = createAsyncThunk("createSudent", async (data, thunkAPI) => {
    try {
        const res = await axiosInstance.post("/admin/create-student", data);
        toast.success(res.data.message || "Student created successfully");
        return res.data.data.user;
    } catch (error) {
        toast.error(error.response?.data?.message || "Failed to create student");
        return thunkAPI.rejectWithValue(error.response?.data?.message);
    }
})

export const updateSudent = createAsyncThunk("updateSudent", async ({ id, data }, thunkAPI) => {
    try {
        const res = await axiosInstance.put(`/admin/update-student/${id}`, data);
        toast.success(res.data.message || "Student updated successfully");
        return res.data.data.user;
    } catch (error) {
        toast.error(error.response?.data?.message || "Failed to updated student");
        return thunkAPI.rejectWithValue(error.response?.data?.message);
    }
})

export const deleteSudent = createAsyncThunk("deleteSudent", async (id, thunkAPI) => {
    try {
        const res = await axiosInstance.delete(`/admin/delete-student/${id}`);
        toast.success(res.data.message || "Student deleted successfully");
        return id;
    } catch (error) {
        toast.error(error.response?.data?.message || "Failed to delete student");
        return thunkAPI.rejectWithValue(error.response?.data?.message);
    }
})

export const createTeacher = createAsyncThunk("createTeacher", async (data, thunkAPI) => {
    try {
        const res = await axiosInstance.post("/admin/create-teacher", data);
        toast.success(res.data.message || "Teacher created successfully");
        return res.data.data.user;
    } catch (error) {
        toast.error(error.response?.data?.message || "Failed to create Teacher");
        return thunkAPI.rejectWithValue(error.response?.data?.message);
    }
})

export const updateTeacher = createAsyncThunk("updateTeacher", async ({ id, data }, thunkAPI) => {
    try {
        const res = await axiosInstance.put(`/admin/update-teacher/${id}`, data);
        toast.success(res.data.message || "Teacher updated successfully");
        return res.data.data.user;
    } catch (error) {
        toast.error(error.response?.data?.message || "Failed to updated Teacher");
        return thunkAPI.rejectWithValue(error.response?.data?.message);
    }
})

export const deleteTeacher = createAsyncThunk("deleteTeacher", async (id, thunkAPI) => {
    try {
        const res = await axiosInstance.delete(`/admin/delete-teacher/${id}`);
        toast.success(res.data.message || "Teacher deleted successfully");
        return id;
    } catch (error) {
        toast.error(error.response?.data?.message || "Failed to delete Teacher");
        return thunkAPI.rejectWithValue(error.response?.data?.message);
    }
})

export const getAllUsers = createAsyncThunk("getAllUsers", async (_, thunkAPI) => {
    try {
        const res = await axiosInstance.get("/admin/users");
        return res.data.data;
    } catch (error) {
        toast.error(error.response?.data?.message || "Failed to fetch users");
        return thunkAPI.rejectWithValue(error.response?.data?.message);
    }
})

const adminSlice = createSlice({
    name: "admin",
    initialState: {
        students: [],
        teachers: [],
        projects: [],
        users: [],
        stats: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(createSudent.fulfilled, (state, action) => {
                if (state.users) state.users.unshift(action.payload);
            })
            .addCase(updateSudent.fulfilled, (state, action) => {
                if (state.users) {
                    state.users = state.users.map(u => u._id === action.payload._id ? { ...u, ...action.payload } : u)
                }
            })
            .addCase(deleteSudent.fulfilled, (state, action) => {
                if (state.users) {
                    state.users = state.users.filter((u) => u._id !== action.payload);
                }
            })
            .addCase(getAllUsers.fulfilled, (state, action) => {
                state.users = action.payload.users;
            })
             .addCase(createTeacher.fulfilled, (state, action) => {
                if (state.users) state.users.unshift(action.payload);
            })
            .addCase(updateTeacher.fulfilled, (state, action) => {
                if (state.users) {
                    state.users = state.users.map(u => u._id === action.payload._id ? { ...u, ...action.payload } : u)
                }
            })
            .addCase(deleteTeacher.fulfilled, (state, action) => {
                if (state.users) {
                    state.users = state.users.filter((u) => u._id !== action.payload);
                }
            })

    },
});

export default adminSlice.reducer;