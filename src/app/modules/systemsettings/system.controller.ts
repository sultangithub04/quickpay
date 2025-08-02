/* eslint-disable @typescript-eslint/no-unused-vars */


import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { SettingServices } from "./system.service";



const createSetting = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
   const payload= req.body



    // const verifiedToken = req.user;

    // const payload = req.body;
    const user = await SettingServices.createSetting(payload)


    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "setting Updated Successfully",
        data: user,
    })
})

// const getAllUsers = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
//     const result = await UserServices.getAllUsers();

//     sendResponse(res, {
//         success: true,
//         statusCode: httpStatus.CREATED,
//         message: "All Users Retrieved Successfully",
//         data: result.data,
//         meta: result.meta
//     })
// })



export const SettingControllers = {
createSetting
}

