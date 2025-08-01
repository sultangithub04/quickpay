import { Router } from "express"
import { UserRoutes } from "../modules/user/user.routes"
import { AuthRoutes } from "../modules/auth/auth.routes"
import { TransactionRoutes } from "../modules/transaction/transaction.routes"
import { AdminRoute } from "../modules/admin/admin.routes"
// import { AuthRoutes } from "../modules/auth/auth.route"
// import { UserRoutes } from "../modules/user/user.route"

export const router = Router()

const moduleRoutes = [
    {
        path: "/user",
        route: UserRoutes
    },
    {
        path: "/auth",
        route: AuthRoutes
    },
    {
        path: "/transactions",
        route: TransactionRoutes
    },
    {
        path: "/admin",
        route: AdminRoute
    }

]

moduleRoutes.forEach((route) => {
    router.use(route.path, route.route)
})

