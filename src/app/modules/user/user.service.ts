import { User } from "./user.model";
import httpStatus from "http-status-codes";
import AppError from "../../errorHelpers/AppError";
import { IUser, Role } from "./user.interface";

const getUser = async (userId: string) => {

    //Check if user exists
    const user = await User.findById(userId).select("-password");

    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, "User not found");
    }
    return user
}

const updateUser = async (userId: string, payload: Partial<IUser>) => {
    const { phone, ...rest } = payload
    const ifUserExist = await User.findById(userId);
    console.log(phone);
    if (!ifUserExist) {
        throw new AppError(httpStatus.NOT_FOUND, "User Not Found")
    }

    if (payload.role === Role.SUPER_ADMIN || payload.role === Role.ADMIN) {
        throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
    }
    const newUpdatedUser = await User.findByIdAndUpdate(userId, rest, { new: true, runValidators: true }).select("-password")

    return newUpdatedUser
}
export const UserServices = {
    getUser, updateUser
}