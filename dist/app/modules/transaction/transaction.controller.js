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
exports.TransactionControllers = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const transaction_service_1 = require("./transaction.service");
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const topUpMoney = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userid = req.user.userId;
    const payload = req.body;
    const user = yield transaction_service_1.TransactionServices.createTopUpMoney(userid, payload);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.CREATED,
        message: "Top Up Successfully",
        data: user,
    });
}));
const withdrawMoney = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userid = req.user.userId;
    const payload = req.body;
    const user = yield transaction_service_1.TransactionServices.createWithdrawMoney(userid, payload);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.CREATED,
        message: "money withdraw Successfully",
        data: user,
    });
}));
const sendMoney = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userid = req.user.userId;
    const payload = req.body;
    const user = yield transaction_service_1.TransactionServices.createSendMoney(userid, payload);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.CREATED,
        message: "send money Successfully",
        data: user,
    });
}));
const cashIn = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userid = req.user.userId;
    const payload = req.body;
    const user = yield transaction_service_1.TransactionServices.createCashIn(userid, payload);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.CREATED,
        message: "Cash in Successfully",
        data: user,
    });
}));
const cashOut = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userid = req.user.userId;
    const payload = req.body;
    const user = yield transaction_service_1.TransactionServices.createCashout(userid, payload);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.CREATED,
        message: "Cash Out Successfully",
        data: user,
    });
}));
const cashOutuser = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userid = req.user.userId;
    const payload = req.body;
    const user = yield transaction_service_1.TransactionServices.createCashoutUser(userid, payload);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.CREATED,
        message: "Cash withdraw Successfully",
        data: user,
    });
}));
const cashInuser = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userid = req.user.userId;
    const payload = req.body;
    const user = yield transaction_service_1.TransactionServices.createCashInUser(userid, payload);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.CREATED,
        message: "Cash Deposit Successfully",
        data: user,
    });
}));
const transactionHistory = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userid = req.user.userId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const user = yield transaction_service_1.TransactionServices.createHistory(userid, page, limit);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.CREATED,
        message: "Transaction Histrory Get Successfully",
        data: user,
    });
}));
const AgentTranHis = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userid = req.user.userId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const user = yield transaction_service_1.TransactionServices.createAgentHistory(userid, page, limit);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.CREATED,
        message: "Agent Transaction Histrory Get Successfully",
        data: user,
    });
}));
exports.TransactionControllers = {
    topUpMoney, withdrawMoney, sendMoney, cashIn, cashOut, transactionHistory, cashOutuser, cashInuser, AgentTranHis
};
