import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { WalletControllers } from "./wallet.controller";
import { Role } from "../user/user.interface";


const router = Router()

router.get("/me", checkAuth(Role.USER, Role.AGENT),  WalletControllers.getWalletInfo)

export const WalletRoutes = router