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
const overView = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userid = req.user.userId;
    const getuser = yield admin_service_1.adminServices.getOverView(userid);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Overview get Successfully",
        data: getuser,
    });
}));
const getAllUser = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userid = req.user.userId;
    const getuser = yield admin_service_1.adminServices.getUserHistory(userid);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "All User get Successfully",
        data: getuser,
    });
}));
const getAllAgent = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // const userid = (req.user as { userId: string }).userId;
    // const userid = (req.user as { userId: string }).userId;
    const userid = req.user.userId;
    const getuser = yield admin_service_1.adminServices.getAgentHistory(userid);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "All Agent get Successfully",
        data: getuser,
    });
}));
const getAllWallet = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userid = req.user.userId;
    const getuser = yield admin_service_1.adminServices.getWalletHistory(userid);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "All Wallet get Successfully",
        data: getuser,
    });
}));
// const getAllTransaction = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
//     const userid = (req.user as { userId: string }).userId;
//     const page = parseInt(req.query.page as string) || 1;
//     const limit = parseInt(req.query.limit as string) || 10;
//     const getuser = await adminServices.getTransactionHistory(userid, page, limit)
//     sendResponse(res, {
//         success: true,
//         statusCode: httpStatus.OK,
//         message: "Transaction history get Successfully",
//         data: getuser,
//     })
// })
const getAllTransaction = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.userId;
    ;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const filters = {
        category: req.query.category,
        status: req.query.status,
        minAmount: req.query.minAmount,
        maxAmount: req.query.maxAmount,
        search: req.query.search,
    };
    const getuser = yield admin_service_1.adminServices.getTransactionHistory(userId, page, limit, filters);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Transaction history fetched successfully",
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
const statusService = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { isActive } = req.body;
    console.log(id, isActive);
    const getuser = yield admin_service_1.adminServices.statusService(id, isActive);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: " Status Change Successfully",
        data: getuser,
    });
}));
const verifyService = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const getuser = yield admin_service_1.adminServices.verifyService(id);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: " verify Successfully",
        data: getuser,
    });
}));
const deleteUser = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const getuser = yield admin_service_1.adminServices.deleteUserService(id);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: " User Deleted Successfully",
        data: getuser,
    });
}));
exports.AdminControllers = {
    getAllUser, getAllAgent, getAllWallet, getAllTransaction, statusService, verifyService,
    blockWallet, unBlockWallet, aproveAgent, deleteUser, overView
};
