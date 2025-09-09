/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextFunction, Request, Response } from "express"
import httpStatus from "http-status-codes"
import { catchAsync } from "../../utils/catchAsync"
import { sendResponse } from "../../utils/sendResponse"
import { AuthServices } from "./auth.service"
import { setAuthCookie } from "../../utils/setCookie"
import AppError from "../../errorHelpers/AppError"
import passport from "passport"
import { createUserTokens } from "../../utils/userTokens"

const registerUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    console.log(req.body);
    const user = await AuthServices.createUser(req.body)


    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "User registered Successfully",
        data: user,
    })
})
const credentialsLogin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    passport.authenticate("local", async (err: any, user: any, info: any) => {


        if (err) {
            return next(new AppError(401, err))
        }

        if (!user) {
            return next(new AppError(401, info.message))
        }
        if (user.isVerify === "false") {
            return next(new AppError(401, info.message))
        }


        const userTokens = createUserTokens(user)
        const { password: pass, ...rest } = user.toObject()
        setAuthCookie(res, userTokens)

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "User Logged In Successfully",
            data: {
                accessToken: userTokens.accessToken,
                refreshToken: userTokens.refreshToken,
                user: rest

            },
        })

    })(req, res, next)


})

const getNewAccessToken = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        throw new AppError(httpStatus.BAD_REQUEST, "No refresh token recieved from cookies")
    }
    const tokenInfo = await AuthServices.getNewAccessToken(refreshToken as string)

    // res.cookie("accessToken", tokenInfo.accessToken, {
    //     httpOnly: true,
    //     secure: false
    // })

    setAuthCookie(res, tokenInfo);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "New Access Token Retrived Successfully",
        data: tokenInfo,
    })
})

const logout = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: true,
        sameSite: "none",



    })
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
    })

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "User Logged Out Successfully",
        data: null,
    })
})
const forgotPassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {


    const { email } = req.body;

    await AuthServices.forgotPassword(email);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Email Sent Successfully",
        data: null,
    })
})
const getEmailbyPhone = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { phone } = req.query;
    const email = await AuthServices.getEmail(phone as string);
    console.log(phone);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Email get Successfully",
        data: email,
    })
})



export const AuthControllers = {
    registerUser,
    credentialsLogin,
    logout, getNewAccessToken, forgotPassword, getEmailbyPhone
}