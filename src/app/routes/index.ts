import { Router } from "express"
import { UserRoutes } from "../modules/user/user.routes"
import { AuthRoutes } from "../modules/auth/auth.routes"
import { TransactionRoutes } from "../modules/transaction/transaction.routes"
import { AdminRoute } from "../modules/admin/admin.routes"
import { WalletRoutes } from "../modules/wallet/wallet.routes"
import { CommissionRoutes } from "../modules/commission/commission.routes"
import { SettingRoutes } from "../modules/systemsettings/system.route"

// import { AuthRoutes } from "../modules/auth/auth.route"
// import { UserRoutes } from "../modules/user/user.route"

export const router = Router()

const moduleRoutes = [
    {
        path: "/users",
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
    },
    {
        path: "/wallets",
        route: WalletRoutes
    },
    {
        path: "/system",
        route: CommissionRoutes
    },
    {
        path: "/setting",
        route: SettingRoutes
    }

]

moduleRoutes.forEach((route) => {
    router.use(route.path, route.route)
})

