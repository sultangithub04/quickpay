import { Types } from "mongoose";

export interface IWallet {
  user: Types.ObjectId;       // Reference to User
  balance: number;            // Current balance
  isBlocked: boolean;         // Whether the wallet is blocked
}
