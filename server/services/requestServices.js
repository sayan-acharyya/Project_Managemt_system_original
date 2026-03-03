import { SupervisorRequest } from "../models/supervisorRequest.js"


export const createRequest = async (requestData) => {
    const existingRequest = await SupervisorRequest.findOne({
        student: requestData.student,
        supervisor: requestData.supervisor,
        status: "pending"
    });

    if (existingRequest) {
        throw new Error("You have already send a request to this supervisor.Please wait for their response");
    }

    const request = await SupervisorRequest.create(requestData);
    return await request.save();
}

export const getAllRequests = async (filters) => {

}
export const acceptRequest = async (requestId, teacherId) => {

}
export const rejectRequest = async (requestId, teacherId) => {

}