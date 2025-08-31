/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express"
import { catchAsync } from "../../utils/catchAsync"
import { sendResponse } from "../../utils/sendResponse"
import httpStatus from "http-status-codes";
import { UserServices } from "./user.service";

const getUserInfo = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
   const userid = (req.user as { userId: string }).userId;
    const user = await UserServices.getUser(userid)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "logged-in user info Get Successfully",
        data: user,
    })
})

const updateUserInfo = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
   const userid = (req.user as { userId: string }).userId;
    const payload= req.body
    const user = await UserServices.updateUser(userid, payload)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "user info updated Successfully",
        data: user,
    })
})
const sendMail = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const payload= req.body
    const user = await UserServices.sendMailService(payload)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Send Mail Successfully",
        data: user,
    })
})



export const UserControllers = {
    getUserInfo,updateUserInfo, sendMail
}
