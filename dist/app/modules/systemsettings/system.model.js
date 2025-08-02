"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SystemSetting = void 0;
const mongoose_1 = require("mongoose");
const stemSettingsSchema = new mongoose_1.Schema({
    transactionFeeRate: { type: Number, required: true }, // Percentage or flat fee,
    agentCommissionRate: { type: Number, required: true }, // % per cash-in/cash-out
    minBalance: { type: Number, required: true }
}, {
    timestamps: true,
    versionKey: false
});
exports.SystemSetting = (0, mongoose_1.model)("SystemSetting", stemSettingsSchema);
