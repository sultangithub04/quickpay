/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express"
import { catchAsync } from "../../utils/catchAsync"
import { sendResponse } from "../../utils/sendResponse"
import httpStatus from "http-status-codes";
import { walletServices } from "./wallet.service";


const getWalletInfo = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userid = (req.user as { userId: string }).userId;
    const user = await walletServices.getWallet(userid)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Wallet info Get Successfully",
        data: user,
    })
})




export const WalletControllers = {
    getWalletInfo
}
