import { Router } from "express";
import { UserControllers } from "./user.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { createUserZodSchema } from "./user.validatation";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "./user.interface";


const router = Router()




router.get("/me", checkAuth(Role.USER),  UserControllers.getUserInfo)
router.patch("/update", checkAuth(Role.USER),  UserControllers.updateUserInfo)


export const UserRoutes = router