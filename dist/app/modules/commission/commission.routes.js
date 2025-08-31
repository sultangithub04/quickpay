"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommissionRoutes = void 0;
// src/modules/systemSettings/systemSettings.routes.ts
const express_1 = require("express");
const commission_controller_1 = require("./commission.controller");
const checkAuth_1 = require("../../middlewares/checkAuth");
const user_interface_1 = require("../user/user.interface");
const router = (0, express_1.Router)();
router.get("/commission", (0, checkAuth_1.checkAuth)(user_interface_1.Role.AGENT), commission_controller_1.commission.getCommmission);
exports.CommissionRoutes = router;
