// src/modules/systemSettings/systemSettings.routes.ts
import { Router } from "express";
import { commission} from "./commission.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";


const router = Router();

router.get("/commission",checkAuth(Role.AGENT) , commission.getCommmission)




export const CommissionRoutes = router;
