import { Router } from "express";

import { TransactionControllers } from "./transaction.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";


const router = Router()



router.patch("/topup",checkAuth(Role.USER, Role.AGENT), TransactionControllers.topUpMoney)
router.patch("/withdraw",checkAuth(Role.USER), TransactionControllers.withdrawMoney)
router.patch("/send",checkAuth(Role.USER), TransactionControllers.sendMoney)
router.patch("/cash-in",checkAuth(Role.AGENT), TransactionControllers.cashIn)
router.patch("/cash-out",checkAuth(Role.AGENT), TransactionControllers.cashOut)
router.patch("/cash-out-user",checkAuth(Role.USER), TransactionControllers.cashOutuser)
router.patch("/cash-in-user",checkAuth(Role.USER), TransactionControllers.cashInuser)
router.get("/me",checkAuth(Role.AGENT, Role.USER, Role.ADMIN), TransactionControllers.transactionHistory)


export const TransactionRoutes = router