import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";

import { Role } from "../user/user.interface";
import { SettingControllers } from "./system.controller";

const router = Router()



router.patch("/setting", checkAuth(Role.ADMIN), SettingControllers.createSetting )


export const SettingRoutes = router