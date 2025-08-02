import { model, Schema } from "mongoose"
import { ISystemSettings } from "./system.interface"

const stemSettingsSchema = new Schema<ISystemSettings>(
  {
    transactionFeeRate: { type: Number, required: true },    // Percentage or flat fee,
    agentCommissionRate: { type: Number, required: true },  // % per cash-in/cash-out
    minBalance: { type: Number, required: true }
  },
  
    {
    timestamps: true,
    versionKey: false
}
  
)

export const SystemSetting = model<ISystemSettings>("SystemSetting", stemSettingsSchema)