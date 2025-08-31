import z from "zod";
import { IsActive, Role } from "./user.interface";

export const createUserZodSchema = z.object({
    name: z.string().min(1, "Name is required").optional(),
    email: z.string().email("Invalid email format").optional(),
    phone: z
        .string()
        .regex(/^01\d{09}$/, {
            message: "Phone number must be exactly 11 digits and start with '01'",
        }),
    password: z.string().min(6, "Password must be at least 6 characters"),
    address: z.string().optional(),
    role: z.enum(Object.values(Role) as [string]).optional(),
    isActive:z.enum(Object.values(IsActive) as [string]).optional(),
    isApproved: z.boolean().optional(),
    isVerify: z.boolean().optional(),
})


  