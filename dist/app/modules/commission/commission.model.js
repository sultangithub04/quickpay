"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Commission = void 0;
const mongoose_1 = require("mongoose");
const commissionSchema = new mongoose_1.Schema({
    agent: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User", // or "Agent" depending on your model
        required: true,
    },
    transaction: {
        type: mongoose_1.Schema.Types.ObjectId,
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
}, {
    timestamps: false,
    versionKey: false
});
exports.Commission = (0, mongoose_1.model)("Commission", commissionSchema);
