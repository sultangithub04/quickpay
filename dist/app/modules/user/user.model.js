"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const user_interface_1 = require("./user.interface");
const userSchema = new mongoose_1.Schema({
    name: { type: String },
    phone: { type: String, required: true, unique: true },
    email: { type: String },
    password: { type: String, required: true },
    role: {
        type: String,
        enum: Object.values(user_interface_1.Role),
        default: user_interface_1.Role.USER
    },
    address: { type: String },
    isActive: { type: String, enum: Object.values(user_interface_1.IsActive), default: user_interface_1.IsActive.ACTIVE },
    isApproved: { type: Boolean, default: true },
    isVerify: { type: Boolean, default: false },
}, {
    timestamps: true,
    versionKey: false
});
exports.User = (0, mongoose_1.model)("User", userSchema);
