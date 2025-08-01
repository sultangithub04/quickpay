import httpStatus from "http-status-codes";
import AppError from "../../errorHelpers/AppError";
import { Wallet } from "../wallet/wallet.model";
import { ITransaction } from "./transaction.interface";
import { User } from "../user/user.model";
import { Transaction } from "../transaction/transaction.model";
import { IsActive } from "../user/user.interface";
import { number } from "zod";


const getUserHistory = async (userId: string) => {
    const user = await User.findById(userId);
    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, "Admin not found");
    }
    const users = await User.find({ role: "USER" })
    const totalUser = await User.countDocuments({ role: "USER" })
    return { users, totalUser }
}
const getAgentHistory = async (userId: string) => {
    const user = await User.findById(userId);
    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, "Admin not found");
    }
    const users = await User.find({ role: "AGENT" })
    const totalAgent = await User.countDocuments({ role: "AGENT" })
    return { users, totalAgent }
}
const getWalletHistory = async (userId: string) => {
    const user = await User.findById(userId);
    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, "Admin not found");
    }
    const wallets = await Wallet.find().populate('user')
    const TotalWallet = await Wallet.countDocuments()
    return { wallets, TotalWallet }
}
const getTransactionHistory = async (userId: string) => {
    const user = await User.findById(userId);
    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, "Admin not found");
    }
    const transactions = await Transaction.find()
        .sort({ createdAt: -1 })
        .populate("sender receiver initiatedBy");
    const TotalTransaction = await Transaction.countDocuments()
    return { transactions, TotalTransaction }
}
const blockWallet = async (userId: number) => {
    const wallet = await Wallet.findOneAndUpdate({user:userId}, { isBlocked: true }, { new: true });
    if (!wallet) throw new AppError(404, "Wallet not found");
    return wallet
}
const unBlockWallet = async (userId: number) => {
    const wallet = await Wallet.findOneAndUpdate({user:userId}, { isBlocked: false  }, { new: true });
    if (!wallet) throw new AppError(404, "Wallet not found");
    return wallet
}
const aproveAgent = async (userId: number) => {
    const wallet = await User.findOneAndUpdate({phone:userId}, { isActive: IsActive.ACTIVE }, { new: true });
    if (!wallet) throw new AppError(404, "Wallet not found");
    return wallet
}






export const adminServices = {
    getUserHistory, getAgentHistory, getWalletHistory, getTransactionHistory, blockWallet, unBlockWallet, aproveAgent
}



