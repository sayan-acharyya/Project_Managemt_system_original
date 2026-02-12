import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios";
import { toast } from "react-toastify";


export const submitProjectProposal = createAsyncThunk(
    "submitProjectProposal",
    async (data, thunkAPI) => {
        try {
            const res = await axiosInstance.post("/student/project-proposal", data);
            toast.success("Project proposal submitted successfully");
            return res.data.data?.project || res.data.data || res.data;
        } catch (error) {

            toast.success("Previous project not rejects.can't submit new prposal" || error.response.data.message)
        }
        return thunkAPI.rejectWithValue(error.response.data.message)
    }
)
const studentSlice = createSlice({
    name: "student",
    initialState: {
        project: null,
        files: [],
        supervisors: [],
        dashboardStats: [],
        supervisor: null,
        deadlines: [],
        feedback: [],
        status: null,
    },
    reducers: {},
    extraReducers: (builder) => { },
});

export default studentSlice.reducer;