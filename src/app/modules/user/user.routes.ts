import { Router } from "express";


const router = Router()



router.post("/register", (req, res)=>{
    console.log(req, res);
})

// /api/v1/user/:id
export const UserRoutes = router