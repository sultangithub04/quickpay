import { Types } from "mongoose";

export type TransactionType =
  | 'add_money'
  | 'withdraw'
  | 'send'
  | 'cash_in'
  | 'cash_out';

export type TransactionStatus = 'pending' | 'completed' | 'failed';

export interface ITransaction extends Document {
  _id?: string;
  type?: TransactionType;
  amount: number;
  phone?:number,
  sender: Types.ObjectId | null;
  receiver: Types.ObjectId | null;
  initiatedBy?: Types.ObjectId;
  status: TransactionStatus;
  fee?: number;
  commission?: number;
  createdAt: Date;
  updatedAt: Date;
}