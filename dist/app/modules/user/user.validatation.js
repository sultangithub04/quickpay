"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUserZodSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const user_interface_1 = require("./user.interface");
exports.createUserZodSchema = zod_1.default.object({
    name: zod_1.default.string().min(1, "Name is required").optional(),
    email: zod_1.default.string().email("Invalid email format").optional(),
    phone: zod_1.default
        .string()
        .regex(/^01\d{09}$/, {
        message: "Phone number must be exactly 11 digits and start with '01'",
    }),
    password: zod_1.default.string().min(6, "Password must be at least 6 characters"),
    address: zod_1.default.string().optional(),
    role: zod_1.default.enum(Object.values(user_interface_1.Role)).optional(),
    isActive: zod_1.default.enum(Object.values(user_interface_1.IsActive)).optional(),
    isApproved: zod_1.default.boolean().optional(),
    isVerify: zod_1.default.boolean().optional(),
});
