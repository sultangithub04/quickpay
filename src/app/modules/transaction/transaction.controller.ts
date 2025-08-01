import { NextFunction, Request, Response } from "express"
import { catchAsync } from "../../utils/catchAsync"
import { sendResponse } from "../../utils/sendResponse"
import httpStatus from "http-status-codes";
import { TransactionServices } from "./transaction.service";



const topUpMoney = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userid = req.user?.userId
    const payload = req.body
    const user = await TransactionServices.createTopUpMoney(userid, payload)
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Top Up Successfully",
        data: user,
    })
})
const withdrawMoney = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userid = req.user?.userId
    const payload = req.body
    const user = await TransactionServices.createWithdrawMoney(userid, payload)
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "money withdraw Successfully",
        data: user,
    })
})
const sendMoney = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userid = req.user?.userId
    const payload = req.body
    const user = await TransactionServices.createSendMoney(userid, payload)
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "send money Successfully",
        data: user,
    })
})
const cashIn = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userid = req.user?.userId
    const payload = req.body
    const user = await TransactionServices.createCashIn(userid, payload)
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Cash in Successfully",
        data: user,
    })
})
const cashOut = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userid = req.user?.userId
    const payload = req.body
    const user = await TransactionServices.createCashout(userid, payload)
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Cash Out Successfully",
        data: user,
    })
})
const transactionHistory = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userid = req.user?.userId 
    const user = await TransactionServices.createHistory(userid)
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Transaction Histrory Get Successfully",
        data: user,
    })
})




export const TransactionControllers = {
    topUpMoney,withdrawMoney, sendMoney, cashIn, cashOut, transactionHistory
}
