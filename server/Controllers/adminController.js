import { asyncHandler } from "../middlewares/asyncHandler.js";
import ErrorHandler from "../middlewares/error.js";
import { User } from "../models/user.model.js";
import * as userServices from "../services/userServices.js";

export const createStudent = asyncHandler(async (req, res, next) => {
    const { name, email, password, department } = req.body;

    if (!name || !email || !password || !department) {
        return next(new ErrorHandler("Please Provide all required feilds", 400))
    }

    const user = await userServices.createUser({
        name,
        email,
        password,
        department,
        role: "Student"
    });

    res.status(201).json({
        success: true,
        message: "Student created successfully",
        data: { user },
    })

});

export const updateStudent = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const updateData = { ...req.body };
    delete updateData.role;

    const user = await userServices.updateUser(id, updateData);

    if (!user) {
        return next(new ErrorHandler("Student not found", 404));
    }
    res.status(200).json({
        success: true,
        message: "Student updated successfully",
        data: { user }
    })
})

export const deleteStudent = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const user = await userServices.getUserById(id);
    if (!user) {
        return next(new ErrorHandler("Student not found", 404));
    }

    if(user.role !== "Student"){
        return next(new ErrorHandler("User is not a student",400));
    }

    await userServices.deleteUser(id);

    res.status(200).json({
        success:true,
        message:"Student deleted successfully",
    })

})