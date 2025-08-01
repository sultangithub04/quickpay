import httpStatus from "http-status-codes";
import AppError from "../../errorHelpers/AppError";
import { Wallet } from "../wallet/wallet.model";

import { User } from "../user/user.model";


const getWallet = async (userId: string) => {
    // 1. Check if user exists
    const user = await User.findById(userId);
    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, "User not found");
    }
    // 2. Get the user's wallet
    const wallet = await Wallet.findOne({ user: userId }).populate("user");
    if (!wallet) {
        throw new AppError(httpStatus.NOT_FOUND, "Wallet not found");
    }
    return wallet
}




export const walletServices = {
    getWallet
}



