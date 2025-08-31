import { User } from "./user.model";
import httpStatus from "http-status-codes";
import AppError from "../../errorHelpers/AppError";
import { IUser, Role } from "./user.interface";
import { sendEmail, SendEmailOptions } from "../../utils/sendEmail";
import { envVars } from "../../config/env";
import bcryptjs from "bcryptjs";

const getUser = async (userId: string) => {

    //Check if user exists
    const user = await User.findById(userId).select("-password");

    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, "User not found");
    }
    return user
}

const updateUser = async (userId: string, payload: Partial<IUser>) => {
    const { name, email, password: pass } = payload

    const password = await bcryptjs.hash(pass as string, Number(envVars.BCRYPT_SALT_ROUND))

    const rest = { name, email, password }
    const ifUserExist = await User.findById(userId);
    console.log("check", rest);
    if (!ifUserExist) {
        throw new AppError(httpStatus.NOT_FOUND, "User Not Found")
    }

    if (payload.role === Role.SUPER_ADMIN || payload.role === Role.ADMIN) {
        throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
    }
    const newUpdatedUser = await User.findByIdAndUpdate(userId, rest, { new: true, runValidators: true }).select("-password")

    return newUpdatedUser
}
// const sendMailService = async (payload: SendEmailOptions) => {
//     const { name, email: to, message } = payload
//     const templateName = "query"
//     const subject = "queary from Customer"
//     const templateData = {
//         name: name,
//         massage: message
//     }


//     const result = await sendEmail({
//         to,
//         subject,
//         templateName,
//         templateData,
//     });
//     return result
// }
// ১. Payload type
interface SendMailPayload {
    name: string;
    email: string;
    message: string;
}
const sendMailService = async (payload: SendMailPayload): Promise<void> => {
    const { name, email: to, message } = payload;
    const templateName = "query";
    const subject = "query from Customer";
    const templateData = {
        name,
        message,
    };

    await sendEmail({
        to,
        subject,
        templateName,
        templateData,
    });
};
export const UserServices = {
    getUser, updateUser, sendMailService
}