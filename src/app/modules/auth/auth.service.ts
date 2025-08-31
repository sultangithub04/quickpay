/* eslint-disable @typescript-eslint/no-non-null-assertion */
import bcryptjs from "bcryptjs";
import httpStatus from "http-status-codes";
import AppError from "../../errorHelpers/AppError";
import { createNewAccessTokenWithRefreshToken } from "../../utils/userTokens";
import { IUser } from "../user/user.interface";
import { User } from "../user/user.model";
import { Wallet } from "../wallet/wallet.model";
import { envVars } from "../../config/env";
import { sendEmail } from "../../utils/sendEmail";
import jwt from "jsonwebtoken";


const createUser = async (payload: Partial<IUser>) => {
    if (payload.role === "ADMIN") {
        throw new AppError(httpStatus.BAD_REQUEST, "Unathorioze  Access")
    }
    const { phone, password, ...rest } = payload;
    const isUserExist = await User.findOne({ phone })
    if (isUserExist) {
        throw new AppError(httpStatus.BAD_REQUEST, "User Already Exist")
    }
    const hashedPassword = await bcryptjs.hash(password as string, Number(envVars.BCRYPT_SALT_ROUND))
    const user = await User.create({
        phone,
        password: hashedPassword,
        ...rest
    })
    const wallet = await Wallet.create({
        user: user._id,
        balance: 50,
        isBlocked: false,
    });

    return { user, wallet }

}
// const credentialsLogin = async (payload: Partial<IUser>) => {

//     const { phone, password } = payload;

//     const isUserExist = await User.findOne({ phone })

//     if (!isUserExist) {
//         throw new AppError(httpStatus.BAD_REQUEST, "user does not exist")
//     }

//     const isPasswordMatched = await bcryptjs.compare(password as string, isUserExist.password as string)

//     if (!isPasswordMatched) {
//         throw new AppError(httpStatus.BAD_REQUEST, "Incorrect Password")
//     }

//     const userTokens = createUserTokens(isUserExist)


//     // eslint-disable-next-line @typescript-eslint/no-unused-vars
//     const { password: pass, ...rest } = isUserExist.toObject()

//     return {
//         accessToken: userTokens.accessToken,
//         refreshToken: userTokens.refreshToken,
//         user: rest
//     }

// }
const getNewAccessToken = async (refreshToken: string) => {
    const newAccessToken = await createNewAccessTokenWithRefreshToken(refreshToken)

    return {
        accessToken: newAccessToken
    }

}

const forgotPassword = async (email: string) => {
    const isUserExist = await User.findOne({ email });


    if (!isUserExist) {
        throw new AppError(httpStatus.BAD_REQUEST, "User does not exist")
    }

    const jwtPayload = {
        userId: isUserExist._id,
        email: isUserExist.email,
        role: isUserExist.role
    }

    const resetToken = jwt.sign(jwtPayload, envVars.JWT_ACCESS_SECRET, {
        expiresIn: "10m"
    })

    const resetUILink = `${envVars.FRONTEND_URL}/reset-password?id=${isUserExist._id}&token=${resetToken}`

    sendEmail({
        to: isUserExist.email as string,
        subject: "Password Reset",
        templateName: "forgetPassword",
        templateData: {
            name: isUserExist.name,
            resetUILink
        }
    })

    /**
     * http://localhost:5173/reset-password?id=687f310c724151eb2fcf0c41&token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODdmMzEwYzcyNDE1MWViMmZjZjBjNDEiLCJlbWFpbCI6InNhbWluaXNyYXI2QGdtYWlsLmNvbSIsInJvbGUiOiJVU0VSIiwiaWF0IjoxNzUzMTY2MTM3LCJleHAiOjE3NTMxNjY3Mzd9.LQgXBmyBpEPpAQyPjDNPL4m2xLF4XomfUPfoxeG0MKg
     */
}
const getEmail = async (phone: string) => {
    const isUserExist = await User.findOne({ phone });


    if (!isUserExist) {
        throw new AppError(httpStatus.BAD_REQUEST, "User does not exist")
    }
    return isUserExist.email

}

export const AuthServices = {
    createUser,
    // credentialsLogin,
    getNewAccessToken, forgotPassword, getEmail
}