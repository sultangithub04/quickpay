import { Schema, model } from "mongoose";
import { ICommission } from "./commission.interface";

const commissionSchema = new Schema<ICommission>(
  {
    agent: {
      type: Schema.Types.ObjectId,
      ref: "User", // or "Agent" depending on your model
      required: true,
    },
    transaction: {
      type: Schema.Types.ObjectId,
      ref: "Transaction",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: false, 
    versionKey: false
  }
);

export const Commission = model<ICommission>("Commission", commissionSchema);
