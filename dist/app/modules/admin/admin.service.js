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
/* eslint-disable @typescript-eslint/no-explicit-any */
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
    const users = yield user_model_1.User.find({ role: { $in: ["USER", "AGENT"] } });
    const totalUser = yield user_model_1.User.countDocuments({ role: "USER" });
    const totalAgent = yield user_model_1.User.countDocuments({ role: "AGENT" });
    return { users, totalUser, totalAgent };
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
// const getTransactionHistory = async (userId: string, page: number = 1, limit: number = 10) => {
//     // 1. Check if user exists
//     const user = await User.findById(userId);
//     if (!user) {
//         throw new AppError(httpStatus.NOT_FOUND, "User not found");
//     }
//     // 3. Calculate skip
//     const skip = (page - 1) * limit;
//     // 4. Fetch transactions with pagination
//     const transactions = await Transaction.find()
//         .sort({ createdAt: -1 }) // latest first
//         .skip(skip)
//         .limit(limit)
//         .exec();
//     // 5. Get total count for pagination info
//     const total = await Transaction.countDocuments();
//     return {
//         meta: {
//             page,
//             limit,
//             total,
//             totalPages: Math.ceil(total / limit),
//         },
//         data: transactions,
//     };
// }
// const getTransactionHistory = async (userId: string, page: number = 1, limit: number = 10) => {
//     const user = await User.findById(userId);
//     if (!user) {
//         throw new AppError(httpStatus.NOT_FOUND, "User not found");
//     }
//     const skip = (page - 1) * limit;
//     const transactions = await Transaction.find().populate("receiver sender initiatedBy", "name phone")
//         .sort({ createdAt: -1 }) // latest first
//         .skip(skip)
//         .limit(limit)
//         .exec();
//     const total = await Transaction.countDocuments();
//     return {
//         meta: {
//             page,
//             limit,
//             total,
//             totalPages: Math.ceil(total / limit),
//         },
//         data: transactions,
//     };
// }
// const getTransactionHistory = async (
//     userId: string,
//     page: number = 1,
//     limit: number = 10,
//     filters: any = {}
// ) => {
//     // Check if user exists
//     const user = await User.findById(userId);
//     if (!user) {
//         throw new AppError(httpStatus.NOT_FOUND, "User not found");
//     }
//     const skip = (page - 1) * limit;
//     // 🔹 Build dynamic filter query
//     const query: any = {};
//     if (filters.category) {
//         query.type = filters.category; // যেমন: CASH_IN, SEND_MONEY
//     }
//     if (filters.status) {
//         query.status = filters.status; // যেমন: PENDING, SUCCESS, FAILED
//     }
//     if (filters.minAmount || filters.maxAmount) {
//         query.amount = {};
//         if (filters.minAmount) query.amount.$gte = Number(filters.minAmount);
//         if (filters.maxAmount) query.amount.$lte = Number(filters.maxAmount);
//     }
//     if (filters.search) {
//         query.$or = [
//             { "sender.name": { $regex: filters.search, $options: "i" } },
//             { "receiver.name": { $regex: filters.search, $options: "i" } },
//         ];
//     }
//     // 🔹 Fetch transactions
//     const transactions = await Transaction.find(query)
//         .populate("receiver sender initiatedBy", "name phone")
//         .sort({ createdAt: -1 })
//         .skip(skip)
//         .limit(limit)
//         .exec();
//     const total = await Transaction.countDocuments(query);
//     return {
//         meta: {
//             page,
//             limit,
//             total,
//             totalPages: Math.ceil(total / limit),
//         },
//         data: transactions,
//     };
// };
const getTransactionHistory = (userId_1, ...args_1) => __awaiter(void 0, [userId_1, ...args_1], void 0, function* (userId, page = 1, limit = 10, filters = {}) {
    // Check if user exists
    const user = yield user_model_1.User.findById(userId);
    if (!user) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "User not found");
    }
    const skip = (page - 1) * limit;
    // 🔹 Build dynamic match query
    const match = {};
    if (filters.category) {
        match.type = filters.category; // যেমন: CASH_IN, SEND_MONEY
    }
    if (filters.status) {
        match.status = filters.status; // যেমন: PENDING, SUCCESS, FAILED
    }
    if (filters.minAmount || filters.maxAmount) {
        match.amount = {};
        if (filters.minAmount)
            match.amount.$gte = Number(filters.minAmount);
        if (filters.maxAmount)
            match.amount.$lte = Number(filters.maxAmount);
    }
    // 🔹 Aggregation pipeline
    const pipeline = [
        { $match: match },
        // Join sender
        {
            $lookup: {
                from: "users",
                localField: "sender",
                foreignField: "_id",
                as: "sender"
            }
        },
        { $unwind: { path: "$sender", preserveNullAndEmptyArrays: true } },
        // Join receiver
        {
            $lookup: {
                from: "users",
                localField: "receiver",
                foreignField: "_id",
                as: "receiver"
            }
        },
        { $unwind: { path: "$receiver", preserveNullAndEmptyArrays: true } },
        // Join initiatedBy
        {
            $lookup: {
                from: "users",
                localField: "initiatedBy",
                foreignField: "_id",
                as: "initiatedBy"
            }
        },
        { $unwind: { path: "$initiatedBy", preserveNullAndEmptyArrays: true } },
    ];
    // 🔹 Search filter (by name / phone)
    if (filters.search) {
        pipeline.push({
            $match: {
                $or: [
                    { "sender.name": { $regex: filters.search, $options: "i" } },
                    { "receiver.name": { $regex: filters.search, $options: "i" } },
                    { "sender.phone": { $regex: filters.search, $options: "i" } },
                    { "receiver.phone": { $regex: filters.search, $options: "i" } },
                ]
            }
        });
    }
    // 🔹 Sort, Pagination
    pipeline.push({ $sort: { createdAt: -1 } }, { $skip: skip }, { $limit: limit });
    // Fetch data
    const transactions = yield transaction_model_1.Transaction.aggregate(pipeline);
    // Total count (without pagination)
    const countPipeline = [...pipeline];
    countPipeline.pop(); // remove limit
    countPipeline.pop(); // remove skip
    countPipeline.pop(); // remove sort
    countPipeline.push({ $count: "total" });
    const totalResult = yield transaction_model_1.Transaction.aggregate(countPipeline);
    const total = totalResult.length > 0 ? totalResult[0].total : 0;
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
const deleteUserService = (_id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_model_1.User.deleteOne({ _id });
    if (result.deletedCount === 0) {
        throw new AppError_1.default(404, "User not found");
    }
    return result;
});
const getOverView = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(userId);
    if (!user) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Admin not found");
    }
    const totalUser = yield user_model_1.User.countDocuments({ role: "USER" });
    const totalAgent = yield user_model_1.User.countDocuments({ role: "AGENT" });
    const totaltransaction = yield transaction_model_1.Transaction.countDocuments();
    const result = yield transaction_model_1.Transaction.aggregate([
        {
            $group: {
                _id: null,
                totalVolume: { $sum: "$amount" },
            },
        },
    ]);
    const totalVolume = result.length > 0 ? result[0].totalVolume : 0;
    return { totalUser, totalAgent, totaltransaction, totalVolume };
});
exports.adminServices = {
    getUserHistory, getAgentHistory, getOverView,
    getWalletHistory, getTransactionHistory, blockWallet, unBlockWallet, aproveAgent, deleteUserService
};
