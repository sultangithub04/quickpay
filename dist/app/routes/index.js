"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const user_routes_1 = require("../modules/user/user.routes");
const auth_routes_1 = require("../modules/auth/auth.routes");
const transaction_routes_1 = require("../modules/transaction/transaction.routes");
const admin_routes_1 = require("../modules/admin/admin.routes");
// import { AuthRoutes } from "../modules/auth/auth.route"
// import { UserRoutes } from "../modules/user/user.route"
exports.router = (0, express_1.Router)();
const moduleRoutes = [
    {
        path: "/user",
        route: user_routes_1.UserRoutes
    },
    {
        path: "/auth",
        route: auth_routes_1.AuthRoutes
    },
    {
        path: "/transactions",
        route: transaction_routes_1.TransactionRoutes
    },
    {
        path: "/admin",
        route: admin_routes_1.AdminRoute
    }
];
moduleRoutes.forEach((route) => {
    exports.router.use(route.path, route.route);
});
