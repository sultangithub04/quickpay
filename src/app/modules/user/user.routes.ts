import { Router } from "express";
import { UserControllers } from "./user.controller";;
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "./user.interface";


const router = Router()




router.get("/me", checkAuth(Role.USER, Role.AGENT, Role.ADMIN, Role.SUPER_ADMIN),  UserControllers.getUserInfo)
router.patch("/update", checkAuth(Role.USER, Role.AGENT, Role.ADMIN),  UserControllers.updateUserInfo)
router.post("/sendmail", UserControllers.sendMail);


export const UserRoutes = router