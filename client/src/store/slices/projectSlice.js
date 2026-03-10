
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios";
import { toast } from "react-toastify";

export const downloadProjectFiles = createAsyncThunk(
    "downloadProjectFiles",
    async ({ projectId, fileId }, thunkAPI) => {
        try {
            const res = await axiosInstance.get(`/project/${projectId}/files/${fileId}/download`,
                
            );

            return res.data;
        } catch (error) {
            toast.error(error.response.data.message || "Failed to download files");
            return thunkAPI.rejectWithValue(error.response.data.message);
        }
    })


const projectSlice = createSlice({
    name: "project",
    initialState: {
        projects: [],
        selected: null,
    },
    reducers: {},
    extraReducers: (builder) => { },
});

export default projectSlice.reducer;
