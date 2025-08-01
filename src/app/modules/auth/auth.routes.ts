import { Router } from "express";
import { AuthControllers } from "./auth.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { createUserZodSchema } from "../user/user.validatation";

const router = Router()

router.post("/register",validateRequest(createUserZodSchema), AuthControllers.registerUser)
router.post("/login", AuthControllers.credentialsLogin)
router.post("/logout", AuthControllers.logout)

export const AuthRoutes = router;