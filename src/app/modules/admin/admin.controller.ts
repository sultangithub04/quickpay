/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express"
import httpStatus from "http-status-codes"
import AppError from "../../errorHelpers/AppError"
import { catchAsync } from "../../utils/catchAsync"
import { sendResponse } from "../../utils/sendResponse"
import { adminServices } from "./admin.service"
import { User } from "../user/user.model"

const getAllUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userid = req.user?.userId
    const getuser = await adminServices.getUserHistory(userid)
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "All User get Successfully",
        data: getuser,
    })
})
const getAllAgent = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userid = req.user?.userId
    const getuser = await adminServices.getAgentHistory(userid)
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "All Agent get Successfully",
        data: getuser,
    })
})
const getAllWallet = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userid = req.user?.userId
    const getuser = await adminServices.getWalletHistory(userid)
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "All Wallet get Successfully",
        data: getuser,
    })
})
const getAllTransaction = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userid = req.user?.userId
    const getuser = await adminServices.getTransactionHistory(userid)
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "All Wallet get Successfully",
        data: getuser,
    })
})
const blockWallet = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { walletId } = req.params;
    const finduserId = await User.findOne({ phone: walletId })
    if (!finduserId) {
        throw new AppError(404, "Wallet not found")
    }
    const userId= finduserId._id
    const getuser = await adminServices.blockWallet(userId)
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: " Wallet block Successfully",
        data: getuser,
    })
})
const unBlockWallet = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { walletId } = req.params;
    const finduserId = await User.findOne({ phone: walletId })
    if (!finduserId) {
        throw new AppError(404, "Wallet not found")
    }
    const userId= finduserId._id
    const getuser = await adminServices.unBlockWallet(userId)
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: " Wallet unBlock Successfully",
        data: getuser,
    })
})
const aproveAgent = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const getuser = await adminServices.aproveAgent(id)
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: " Wallet unBlock Successfully",
        data: getuser,
    })
})


export const AdminControllers = {
    getAllUser, getAllAgent, getAllWallet, getAllTransaction, blockWallet, unBlockWallet, aproveAgent
}