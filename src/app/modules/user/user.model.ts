import { model, Schema } from "mongoose";
import { IsActive, IUser, Role } from "./user.interface";

const userSchema = new Schema<IUser>({
    name: { type: String},
    phone: { type: String, required: true, unique: true },
    email: { type: String },
    password: { type: String, required: true},
    role: {
        type: String,
        enum: Object.values(Role),
        default: Role.USER
    },
    address: { type: String },
    isActive: { type: String, enum: Object.values(IsActive), default: IsActive.ACTIVE },
    isApproved: { type: Boolean, default: true },
    isVerify:{ type: Boolean, default: false },

}, {
    timestamps: true,
    versionKey: false
})

export const User= model<IUser>("User", userSchema)