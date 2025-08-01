import { Router } from "express";
import { AdminControllers } from "./admin.controller";
import { Role } from "../user/user.interface";
import { checkAuth } from "../../middlewares/checkAuth";


const router = Router()

router.get("/users",checkAuth(Role.ADMIN), AdminControllers.getAllUser)
router.get("/agents",checkAuth(Role.ADMIN), AdminControllers.getAllAgent)
router.get("/wallets",checkAuth(Role.ADMIN), AdminControllers.getAllWallet)
router.get("/transactions",checkAuth(Role.ADMIN), AdminControllers.getAllTransaction)
router.patch("/wallets/block/:walletId", checkAuth(Role.ADMIN), AdminControllers.blockWallet)
router.patch("/wallets/unblock/:walletId", checkAuth(Role.ADMIN), AdminControllers.unBlockWallet)
router.patch("/agents/approve/:id", checkAuth(Role.ADMIN), AdminControllers.aproveAgent)
// router.patch("/agents/approve/:id", AdminControllers.logout)
// router.patch("/agents/suspend/:id", AdminControllers.logout)
// router.patch("/system-settings", AdminControllers.logout)

export const AdminRoute = router;