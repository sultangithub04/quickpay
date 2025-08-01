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
exports.adminServices = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const wallet_model_1 = require("../wallet/wallet.model");
const user_model_1 = require("../user/user.model");
const transaction_model_1 = require("../transaction/transaction.model");
const user_interface_1 = require("../user/user.interface");
const getUserHistory = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(userId);
    if (!user) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Admin not found");
    }
    const users = yield user_model_1.User.find({ role: "USER" });
    const totalUser = yield user_model_1.User.countDocuments({ role: "USER" });
    return { users, totalUser };
});
const getAgentHistory = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(userId);
    if (!user) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Admin not found");
    }
    const users = yield user_model_1.User.find({ role: "AGENT" });
    const totalAgent = yield user_model_1.User.countDocuments({ role: "AGENT" });
    return { users, totalAgent };
});
const getWalletHistory = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(userId);
    if (!user) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Admin not found");
    }
    const wallets = yield wallet_model_1.Wallet.find().populate('user');
    const TotalWallet = yield wallet_model_1.Wallet.countDocuments();
    return { wallets, TotalWallet };
});
const getTransactionHistory = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(userId);
    if (!user) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Admin not found");
    }
    const transactions = yield transaction_model_1.Transaction.find()
        .sort({ createdAt: -1 })
        .populate("sender receiver initiatedBy");
    const TotalTransaction = yield transaction_model_1.Transaction.countDocuments();
    return { transactions, TotalTransaction };
});
const blockWallet = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const wallet = yield wallet_model_1.Wallet.findOneAndUpdate({ user: userId }, { isBlocked: true }, { new: true });
    if (!wallet)
        throw new AppError_1.default(404, "Wallet not found");
    return wallet;
});
const unBlockWallet = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const wallet = yield wallet_model_1.Wallet.findOneAndUpdate({ user: userId }, { isBlocked: false }, { new: true });
    if (!wallet)
        throw new AppError_1.default(404, "Wallet not found");
    return wallet;
});
const aproveAgent = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const wallet = yield user_model_1.User.findOneAndUpdate({ phone: userId }, { isActive: user_interface_1.IsActive.ACTIVE }, { new: true });
    if (!wallet)
        throw new AppError_1.default(404, "Wallet not found");
    return wallet;
});
exports.adminServices = {
    getUserHistory, getAgentHistory, getWalletHistory, getTransactionHistory, blockWallet, unBlockWallet, aproveAgent
};
