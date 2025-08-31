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
const user_interface_1 = require("../user/user.interface");
const commission_model_1 = require("../commission/commission.model");
const system_model_1 = require("../systemsettings/system.model");
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
    // console.log(receiverUser);
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
// check crate function
// const createCashIn = async (userId: string, payload: Partial<ITransaction>) => {
//   // 1. Check if user exists
//   const user = await User.findById(userId);
//   if (!user) throw new AppError(httpStatus.NOT_FOUND, "User not found");
//   // 2. Get sender wallet
//   const senderWallet = await Wallet.findOne({ user: userId });
//   if (!senderWallet) throw new AppError(httpStatus.NOT_FOUND, "Wallet not found");
//   const { phone, amount } = payload;
//   if (!amount || amount <= 0) throw new AppError(httpStatus.BAD_REQUEST, "Invalid amount");
//   // 3. Find receiver user and wallet
//   const receiverUser = await User.findOne({ phone });
//   if (!receiverUser) throw new AppError(httpStatus.NOT_FOUND, "Receiver user not found");
//   const receiverWallet = await Wallet.findOne({ user: receiverUser._id });
//   if (!receiverWallet) throw new AppError(httpStatus.NOT_FOUND, "Receiver wallet not found");
//   // 4. Get system settings (for commission rate)
//   const systemSettings = await SystemSetting.findOne();
//   if (!systemSettings) throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "System settings not found");
//   const commissionAmount = (amount * systemSettings.agentCommissionRate) / 100;
//   // 5. Update balances
//   senderWallet.balance -= amount;
//   receiverWallet.balance += amount;
//   // ✅ Add commission to agent (if sender is agent)
//   if (user.role === Role.AGENT) {
//     senderWallet.balance += commissionAmount; // agent earns
//   }
//   await senderWallet.save();
//   await receiverWallet.save();
//   // 6. Record the transaction
//   const transaction = await Transaction.create({
//     type: "cash-in",
//     amount,
//     sender: user._id,
//     receiver: receiverUser._id,
//     initiatedBy: user._id,
//     status: "completed",
//     fee: 0,
//     commission: commissionAmount,
//   });
//   // 7. Create commission entry if agent
//   if (user.role === Role.AGENT) {
//     await Commission.create({
//       agent: user._id,
//       transaction: transaction._id,
//       amount: commissionAmount,
//       createdAt: new Date(),
//     });
//   }
//   return {
//     transactionId: transaction._id,
//     newBalance: senderWallet.balance,
//   };
// };
const createCashIn = (userId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    // 1. Check if user exists
    const user = yield user_model_1.User.findById(userId);
    // console.log(user);
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
    // 4. Get system settings (for commission rate)
    const systemSettings = yield system_model_1.SystemSetting.findOne();
    if (!systemSettings)
        throw new AppError_1.default(http_status_codes_1.default.INTERNAL_SERVER_ERROR, "System settings not found");
    const commissionAmount = (amount * systemSettings.agentCommissionRate) / 100;
    console.log(commissionAmount);
    senderWallet.balance -= amount;
    receiverWallet.balance += amount;
    //  Add commission to agent (if sender is agent)
    if (user.role === user_interface_1.Role.AGENT) {
        senderWallet.balance += commissionAmount; // agent earns
    }
    yield senderWallet.save();
    yield receiverWallet.save();
    // 5. Record the transaction
    const transaction = yield transaction_model_1.Transaction.create({
        type: "cash_in",
        amount: amount,
        sender: user._id,
        receiver: receiverUser._id,
        initiatedBy: user._id,
        status: "completed",
        fee: 0,
        commission: commissionAmount,
    });
    if (user.role === user_interface_1.Role.AGENT) {
        yield commission_model_1.Commission.create({
            agent: user._id,
            transaction: transaction._id,
            amount: commissionAmount,
            createdAt: new Date(),
        });
    }
    return {
        transactionId: transaction._id,
        newBalance: senderWallet.balance,
    };
});
const createCashout = (userId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    // 1. Check if user exists
    const user = yield user_model_1.User.findById(userId);
    // console.log(user);
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
    // 4. Get system settings (for commission rate)
    const systemSettings = yield system_model_1.SystemSetting.findOne();
    if (!systemSettings)
        throw new AppError_1.default(http_status_codes_1.default.INTERNAL_SERVER_ERROR, "System settings not found");
    const commissionAmount = (amount * systemSettings.agentCommissionRate) / 100;
    console.log(commissionAmount);
    senderWallet.balance += amount;
    receiverWallet.balance -= amount;
    //  Add commission to agent (if sender is agent)
    if (user.role === user_interface_1.Role.AGENT) {
        senderWallet.balance += commissionAmount; // agent earns
    }
    yield senderWallet.save();
    yield receiverWallet.save();
    // 5. Record the transaction
    const transaction = yield transaction_model_1.Transaction.create({
        type: "cash_in",
        amount: amount,
        sender: user._id,
        receiver: receiverUser._id,
        initiatedBy: user._id,
        status: "completed",
        fee: 0,
        commission: commissionAmount,
    });
    if (user.role === user_interface_1.Role.AGENT) {
        yield commission_model_1.Commission.create({
            agent: user._id,
            transaction: transaction._id,
            amount: commissionAmount,
            createdAt: new Date(),
        });
    }
    return {
        transactionId: transaction._id,
        newBalance: senderWallet.balance,
    };
});
// const createHistory = async (userId: string) => {
//   // 1. Check if user exists
//   const user = await User.findById(userId);
//   // console.log(user);
//   if (!user) {
//     throw new AppError(httpStatus.NOT_FOUND, "User not found");
//   }
//   // console.log("user", user);
//   // // 2. Get the user's wallet
//   // const getWallet = await Wallet.findOne({ user: userId });
//   // // console.log("sender www",senderWallet);
//   // if (!getWallet) {
//   //   throw new AppError(httpStatus.NOT_FOUND, "Wallet not found");
//   // }
//   // Filter: Show transactions where user is sender or receiver or initiatedBy
//   const filter = {
//     $or: [
//       { sender: userId },
//       { receiver: userId },
//       { initiatedBy: userId }
//     ]
//   };
//   const transactions = await Transaction.find(filter)
//     .sort({ createdAt: -1 })
//     .exec();
//   const total = await Transaction.countDocuments(filter);
//   return { transactions, total }
// }
const createHistory = (userId_1, ...args_1) => __awaiter(void 0, [userId_1, ...args_1], void 0, function* (userId, page = 1, limit = 10) {
    // 1. Check if user exists
    const user = yield user_model_1.User.findById(userId);
    if (!user) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "User not found");
    }
    // 2. Filter: Show transactions where user is sender, receiver, or initiatedBy
    const filter = {
        $or: [
            { sender: userId },
            { receiver: userId },
            { initiatedBy: userId }
        ]
    };
    // 3. Calculate skip
    const skip = (page - 1) * limit;
    // 4. Fetch transactions with pagination
    const transactions = yield transaction_model_1.Transaction.find(filter)
        .sort({ createdAt: -1 }) // latest first
        .skip(skip)
        .limit(limit)
        .exec();
    // 5. Get total count for pagination info
    const total = yield transaction_model_1.Transaction.countDocuments(filter);
    return {
        meta: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
        data: transactions,
    };
});
const createCashoutUser = (userId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    // 1. Check if user exists
    const user = yield user_model_1.User.findById(userId);
    // console.log(user);
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
    // 4. Get system settings (for commission rate)
    const systemSettings = yield system_model_1.SystemSetting.findOne();
    if (!systemSettings)
        throw new AppError_1.default(http_status_codes_1.default.INTERNAL_SERVER_ERROR, "System settings not found");
    const commissionAmount = (amount * systemSettings.agentCommissionRate) / 100;
    console.log(commissionAmount);
    senderWallet.balance -= amount;
    receiverWallet.balance += amount;
    //  Add commission to agent (if sender is agent)
    yield senderWallet.save();
    yield receiverWallet.save();
    // 5. Record the transaction
    const transaction = yield transaction_model_1.Transaction.create({
        type: "withdraw",
        amount: amount,
        sender: user._id,
        receiver: receiverUser._id,
        initiatedBy: user._id,
        status: "completed",
        fee: 0,
        commission: commissionAmount,
    });
    if (user.role === user_interface_1.Role.AGENT) {
        yield commission_model_1.Commission.create({
            agent: user._id,
            transaction: transaction._id,
            amount: commissionAmount,
            createdAt: new Date(),
        });
    }
    return {
        transactionId: transaction._id,
        newBalance: senderWallet.balance,
    };
});
const createCashInUser = (userId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    // 1. Check if user exists
    const user = yield user_model_1.User.findById(userId);
    // console.log(user);
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
    // 4. Get system settings (for commission rate)
    const systemSettings = yield system_model_1.SystemSetting.findOne();
    if (!systemSettings)
        throw new AppError_1.default(http_status_codes_1.default.INTERNAL_SERVER_ERROR, "System settings not found");
    const commissionAmount = (amount * systemSettings.agentCommissionRate) / 100;
    senderWallet.balance += amount;
    receiverWallet.balance -= amount;
    //  Add commission to agent (if sender is agent)
    yield senderWallet.save();
    yield receiverWallet.save();
    // 5. Record the transaction
    const transaction = yield transaction_model_1.Transaction.create({
        type: "add_money",
        amount: amount,
        sender: user._id,
        receiver: receiverUser._id,
        initiatedBy: user._id,
        status: "completed",
        fee: 0,
        commission: commissionAmount,
    });
    if (user.role === user_interface_1.Role.AGENT) {
        yield commission_model_1.Commission.create({
            agent: user._id,
            transaction: transaction._id,
            amount: commissionAmount,
            createdAt: new Date(),
        });
    }
    return {
        transactionId: transaction._id,
        newBalance: senderWallet.balance,
    };
});
exports.TransactionServices = {
    createCashInUser, createTopUpMoney, createWithdrawMoney, createSendMoney, createCashIn, createCashout, createHistory, createCashoutUser
};
