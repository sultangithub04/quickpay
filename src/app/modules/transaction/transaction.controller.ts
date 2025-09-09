/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express"
import { catchAsync } from "../../utils/catchAsync"
import { sendResponse } from "../../utils/sendResponse"
import httpStatus from "http-status-codes";
import { TransactionServices } from "./transaction.service";



// eslint-disable-next-line @typescript-eslint/no-unused-vars
const topUpMoney = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userid = (req.user as { userId: string }).userId;
    const payload = req.body
    const user = await TransactionServices.createTopUpMoney(userid, payload)
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Top Up Successfully",
        data: user,
    })
})
const withdrawMoney = catchAsync(async (req: Request, res: Response) => {
    const userid = (req.user as { userId: string }).userId;
    const payload = req.body
    const user = await TransactionServices.createWithdrawMoney(userid, payload)
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "money withdraw Successfully",
        data: user,
    })
})
const sendMoney = catchAsync(async (req: Request, res: Response) => {
    const userid = (req.user as { userId: string }).userId;
    const payload = req.body
    const user = await TransactionServices.createSendMoney(userid, payload)
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "send money Successfully",
        data: user,
    })
})
const cashIn = catchAsync(async (req: Request, res: Response) => {
    const userid = (req.user as { userId: string }).userId;
    const payload = req.body
    const user = await TransactionServices.createCashIn(userid, payload)
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Cash in Successfully",
        data: user,
    })
})
const cashOut = catchAsync(async (req: Request, res: Response) => {
    const userid = (req.user as { userId: string }).userId;
    const payload = req.body
    const user = await TransactionServices.createCashout(userid, payload)
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Cash Out Successfully",
        data: user,
    })
})
const cashOutuser = catchAsync(async (req: Request, res: Response) => {
    const userid = (req.user as { userId: string }).userId;
    const payload = req.body
    const user = await TransactionServices.createCashoutUser(userid, payload)
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Cash withdraw Successfully",
        data: user,
    })
})
const cashInuser = catchAsync(async (req: Request, res: Response) => {
    const userid = (req.user as { userId: string }).userId;
    const payload = req.body
    const user = await TransactionServices.createCashInUser(userid, payload)
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Cash Deposit Successfully",
        data: user,
    })
})
const transactionHistory = catchAsync(async (req: Request, res: Response) => {
    const userid = (req.user as { userId: string }).userId;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const user = await TransactionServices.createHistory(userid, page, limit)
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Transaction Histrory Get Successfully",
        data: user,
    })
})
const AgentTranHis = catchAsync(async (req: Request, res: Response) => {
    const userid = (req.user as { userId: string }).userId;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const user = await TransactionServices.createAgentHistory(userid, page, limit)
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Agent Transaction Histrory Get Successfully",
        data: user,
    })
})




export const TransactionControllers = {
    topUpMoney, withdrawMoney, sendMoney, cashIn, cashOut, transactionHistory, cashOutuser,cashInuser, AgentTranHis
}
