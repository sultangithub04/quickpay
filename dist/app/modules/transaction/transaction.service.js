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
exports.TransactionServices = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const wallet_model_1 = require("../wallet/wallet.model");
const user_model_1 = require("../user/user.model");
const transaction_model_1 = require("./transaction.model");
const createTopUpMoney = (userId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    // 1. Check if user exists
    const user = yield user_model_1.User.findById(userId);
    if (!user) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "User not found");
    }
    // 2. Get the user's wallet
    const wallet = yield wallet_model_1.Wallet.findOne({ user: userId });
    if (!wallet) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Wallet not found");
    }
    const { amount } = payload;
    // 3. Validate amount
    if (!amount || amount <= 0) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Invalid amount");
    }
    // 4. Update wallet balance
    wallet.balance += amount;
    yield wallet.save();
    // 5. Record the transaction
    const transaction = yield transaction_model_1.Transaction.create({
        type: "add_money",
        amount: amount,
        sender: null,
        receiver: user._id,
        initiatedBy: user._id,
        status: "completed",
        fee: 0,
        commission: 0,
    });
    return {
        transactionId: transaction._id,
        newBalance: wallet.balance,
    };
});
const createWithdrawMoney = (userId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    // 1. Check if user exists
    const user = yield user_model_1.User.findById(userId);
    if (!user) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "User not found");
    }
    // 2. Get the user's wallet
    const wallet = yield wallet_model_1.Wallet.findOne({ user: userId });
    if (!wallet) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Wallet not found");
    }
    const { amount } = payload;
    // 3. Validate amount
    if (!amount || amount <= 0) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Invalid amount");
    }
    // 4. Update wallet balance
    wallet.balance -= amount;
    yield wallet.save();
    // 5. Record the transaction
    const transaction = yield transaction_model_1.Transaction.create({
        type: "withdraw",
        amount: amount,
        sender: null,
        receiver: user._id,
        initiatedBy: user._id,
        status: "completed",
        fee: 0,
        commission: 0,
    });
    return {
        transactionId: transaction._id,
        newBalance: wallet.balance,
    };
});
const createSendMoney = (userId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    // 1. Check if user exists
    const user = yield user_model_1.User.findById(userId);
    if (!user) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "User not found");
    }
    // console.log("user", user);
    // 2. Get the user's wallet
    const senderWallet = yield wallet_model_1.Wallet.findOne({ user: userId });
    // console.log("sender www",senderWallet);
    if (!senderWallet) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Wallet not found");
    }
    const { phone, amount } = payload;
    const receiverUser = yield user_model_1.User.findOne({ phone });
    console.log(receiverUser);
    if (!receiverUser) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Receiver user not found");
    }
    const receiverWallet = yield wallet_model_1.Wallet.findOne({ user: receiverUser._id });
    if (!receiverWallet) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Receiver wallet not found");
    }
    // 3. Validate amount
    if (!amount || amount <= 0) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Invalid amount");
    }
    senderWallet.balance -= amount;
    receiverWallet.balance += amount;
    yield senderWallet.save();
    yield receiverWallet.save();
    // 5. Record the transaction
    const transaction = yield transaction_model_1.Transaction.create({
        type: "send",
        amount: amount,
        sender: user._id,
        receiver: receiverUser._id,
        initiatedBy: user._id,
        status: "completed",
        fee: 0,
        commission: 0,
    });
    return {
        transactionId: transaction._id,
        newBalance: senderWallet.balance,
    };
});
const createCashIn = (userId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    // 1. Check if user exists
    const user = yield user_model_1.User.findById(userId);
    console.log(user);
    if (!user) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "User not found");
    }
    // console.log("user", user);
    // 2. Get the user's wallet
    const senderWallet = yield wallet_model_1.Wallet.findOne({ user: userId });
    // console.log("sender www",senderWallet);
    if (!senderWallet) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Wallet not found");
    }
    const { phone, amount } = payload;
    const receiverUser = yield user_model_1.User.findOne({ phone });
    if (!receiverUser) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Receiver user not found");
    }
    const receiverWallet = yield wallet_model_1.Wallet.findOne({ user: receiverUser._id });
    if (!receiverWallet) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Receiver wallet not found");
    }
    // 3. Validate amount
    if (!amount || amount <= 0) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Invalid amount");
    }
    senderWallet.balance -= amount;
    receiverWallet.balance += amount;
    yield senderWallet.save();
    yield receiverWallet.save();
    // 5. Record the transaction
    const transaction = yield transaction_model_1.Transaction.create({
        type: "send",
        amount: amount,
        sender: user._id,
        receiver: receiverUser._id,
        initiatedBy: user._id,
        status: "completed",
        fee: 0,
        commission: 0,
    });
    return {
        transactionId: transaction._id,
        newBalance: senderWallet.balance,
    };
});
const createHistory = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    // 1. Check if user exists
    const user = yield user_model_1.User.findById(userId);
    // console.log(user);
    if (!user) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "User not found");
    }
    // console.log("user", user);
    // // 2. Get the user's wallet
    // const getWallet = await Wallet.findOne({ user: userId });
    // // console.log("sender www",senderWallet);
    // if (!getWallet) {
    //   throw new AppError(httpStatus.NOT_FOUND, "Wallet not found");
    // }
    // Filter: Show transactions where user is sender or receiver or initiatedBy
    const filter = {
        $or: [
            { sender: userId },
            { receiver: userId },
            { initiatedBy: userId }
        ]
    };
    const transactions = yield transaction_model_1.Transaction.find(filter)
        .sort({ createdAt: -1 })
        .exec();
    const total = yield transaction_model_1.Transaction.countDocuments(filter);
    return { transactions, total };
});
const createCashout = (userId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    // 1. Check if user exists
    const user = yield user_model_1.User.findById(userId);
    console.log(user);
    if (!user) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "User not found");
    }
    // console.log("user", user);
    // 2. Get the user's wallet
    const senderWallet = yield wallet_model_1.Wallet.findOne({ user: userId });
    // console.log("sender www",senderWallet);
    if (!senderWallet) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Wallet not found");
    }
    const { phone, amount } = payload;
    const receiverUser = yield user_model_1.User.findOne({ phone });
    if (!receiverUser) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Receiver user not found");
    }
    const receiverWallet = yield wallet_model_1.Wallet.findOne({ user: receiverUser._id });
    if (!receiverWallet) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Receiver wallet not found");
    }
    // 3. Validate amount
    if (!amount || amount <= 0) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Invalid amount");
    }
    senderWallet.balance += amount;
    receiverWallet.balance -= amount;
    yield senderWallet.save();
    yield receiverWallet.save();
    // 5. Record the transaction
    const transaction = yield transaction_model_1.Transaction.create({
        type: "send",
        amount: amount,
        sender: user._id,
        receiver: receiverUser._id,
        initiatedBy: user._id,
        status: "completed",
        fee: 0,
        commission: 0,
    });
    return {
        transactionId: transaction._id,
        newBalance: senderWallet.balance,
    };
});
exports.TransactionServices = {
    createTopUpMoney, createWithdrawMoney, createSendMoney, createCashIn, createCashout, createHistory
};
