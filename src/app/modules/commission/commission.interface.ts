import { Types } from "mongoose";

export interface ICommission {
  agent: Types.ObjectId;
  transaction: Types.ObjectId;
  amount: number;
  createdAt: Date;
}


