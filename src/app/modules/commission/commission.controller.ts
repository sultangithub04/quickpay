/* eslint-disable @typescript-eslint/no-unused-vars */
// src/modules/systemSettings/systemSettings.controller.ts
import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status-codes";



import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { CommissionService } from "./commission.service";


 const getCommmission = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await CommissionService.getCommmission();

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Commission retrieved successfully",
      data: result,
    });
  }
);

export const commission ={
    getCommmission
}
