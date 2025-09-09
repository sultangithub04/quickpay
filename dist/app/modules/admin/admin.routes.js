"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminRoute = void 0;
const express_1 = require("express");
const admin_controller_1 = require("./admin.controller");
const user_interface_1 = require("../user/user.interface");
const checkAuth_1 = require("../../middlewares/checkAuth");
const router = (0, express_1.Router)();
router.get("/overview", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN), admin_controller_1.AdminControllers.overView);
router.get("/users", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN), admin_controller_1.AdminControllers.getAllUser);
router.get("/agents", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN), admin_controller_1.AdminControllers.getAllAgent);
router.get("/wallets", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN), admin_controller_1.AdminControllers.getAllWallet);
router.get("/transactions", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN), admin_controller_1.AdminControllers.getAllTransaction);
router.patch("/wallets/block/:walletId", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN), admin_controller_1.AdminControllers.blockWallet);
router.patch("/wallets/unblock/:walletId", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN), admin_controller_1.AdminControllers.unBlockWallet);
router.patch("/agents/approve/:id", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN), admin_controller_1.AdminControllers.aproveAgent);
router.delete("/delete/user/:id", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN), admin_controller_1.AdminControllers.deleteUser);
router.patch("/status/:id", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN), admin_controller_1.AdminControllers.statusService);
router.patch("/verify/:id", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN), admin_controller_1.AdminControllers.verifyService);
// router.patch("/agents/approve/:id", AdminControllers.logout)
// router.patch("/agents/suspend/:id", AdminControllers.logout)
// router.patch("/system-settings", AdminControllers.logout)
exports.AdminRoute = router;
