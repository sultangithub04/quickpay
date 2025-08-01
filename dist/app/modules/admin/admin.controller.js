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
exports.AdminControllers = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const admin_service_1 = require("./admin.service");
const user_model_1 = require("../user/user.model");
const getAllUser = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userid = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    const getuser = yield admin_service_1.adminServices.getUserHistory(userid);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "All User get Successfully",
        data: getuser,
    });
}));
const getAllAgent = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userid = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    const getuser = yield admin_service_1.adminServices.getAgentHistory(userid);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "All Agent get Successfully",
        data: getuser,
    });
}));
const getAllWallet = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userid = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    const getuser = yield admin_service_1.adminServices.getWalletHistory(userid);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "All Wallet get Successfully",
        data: getuser,
    });
}));
const getAllTransaction = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userid = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    const getuser = yield admin_service_1.adminServices.getTransactionHistory(userid);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "All Wallet get Successfully",
        data: getuser,
    });
}));
const blockWallet = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { walletId } = req.params;
    const finduserId = yield user_model_1.User.findOne({ phone: walletId });
    if (!finduserId) {
        throw new AppError_1.default(404, "Wallet not found");
    }
    const userId = finduserId._id;
    const getuser = yield admin_service_1.adminServices.blockWallet(userId);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: " Wallet block Successfully",
        data: getuser,
    });
}));
const unBlockWallet = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { walletId } = req.params;
    const finduserId = yield user_model_1.User.findOne({ phone: walletId });
    if (!finduserId) {
        throw new AppError_1.default(404, "Wallet not found");
    }
    const userId = finduserId._id;
    const getuser = yield admin_service_1.adminServices.unBlockWallet(userId);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: " Wallet unBlock Successfully",
        data: getuser,
    });
}));
const aproveAgent = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const getuser = yield admin_service_1.adminServices.aproveAgent(id);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: " Wallet unBlock Successfully",
        data: getuser,
    });
}));
exports.AdminControllers = {
    getAllUser, getAllAgent, getAllWallet, getAllTransaction, blockWallet, unBlockWallet, aproveAgent
};
