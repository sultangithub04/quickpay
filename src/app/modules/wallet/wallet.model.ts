import { model, Schema } from "mongoose";
import { IWallet } from "./wallet.interface";

const walletSchema = new Schema<IWallet>({
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    balance: {
        type: Number,
        required: true,
        default: 50, // Initial balance
        min: 0,
    },
    isBlocked: {
        type: Boolean,
      default: false,
    },

}, {
    timestamps: true,
    versionKey: false
})

export const Wallet = model<IWallet>("Wallet", walletSchema)