"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserServices = void 0;
const user_model_1 = require("./user.model");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const user_interface_1 = require("./user.interface");
const sendEmail_1 = require("../../utils/sendEmail");
const env_1 = require("../../config/env");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const getUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    //Check if user exists
    const user = yield user_model_1.User.findById(userId).select("-password");
    if (!user) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "User not found");
    }
    return user;
});
const updateUser = (userId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password: pass } = payload;
    const password = yield bcryptjs_1.default.hash(pass, Number(env_1.envVars.BCRYPT_SALT_ROUND));
    const rest = { name, email, password };
    const ifUserExist = yield user_model_1.User.findById(userId);
    console.log("check", rest);
    if (!ifUserExist) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "User Not Found");
    }
    if (payload.role === user_interface_1.Role.SUPER_ADMIN || payload.role === user_interface_1.Role.ADMIN) {
        throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "You are not authorized");
    }
    const newUpdatedUser = yield user_model_1.User.findByIdAndUpdate(userId, rest, { new: true, runValidators: true }).select("-password");
    return newUpdatedUser;
});
const sendMailService = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email: to, message } = payload;
    const templateName = "query";
    const subject = "query from Customer";
    const templateData = {
        name,
        message,
    };
    yield (0, sendEmail_1.sendEmail)({
        to,
        subject,
        templateName,
        templateData,
    });
});
exports.UserServices = {
    getUser, updateUser, sendMailService
};
