import { Schema, model} from 'mongoose';
import { ITransaction } from './transaction.interface';


const TransactionSchema = new Schema<ITransaction>(
  {
 
    type: {
      type: String,
      enum: ['add_money', 'withdraw', 'send', 'cash_in', 'cash_out']
      
    },
    amount: {
      type: Number,
      min: 0,
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    receiver: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    initiatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
  
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'completed',
    },
    fee: {
      type: Number,
      default: 0,
    },
    commission: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);


export const Transaction = model<ITransaction>('Transaction', TransactionSchema);


