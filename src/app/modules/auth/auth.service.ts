/* eslint-disable @typescript-eslint/no-non-null-assertion */
import bcryptjs from "bcryptjs";
import httpStatus from "http-status-codes";
import AppError from "../../errorHelpers/AppError";
import { createUserTokens } from "../../utils/userTokens";
import { IUser } from "../user/user.interface";
import { User } from "../user/user.model";
import { Wallet } from "../wallet/wallet.model";
import { envVars } from "../../config/env";

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
const credentialsLogin = async (payload: Partial<IUser>) => {

    const { phone, password } = payload;

    const isUserExist = await User.findOne({ phone })

    if (!isUserExist) {
        throw new AppError(httpStatus.BAD_REQUEST, "user does not exist")
    }

    const isPasswordMatched = await bcryptjs.compare(password as string, isUserExist.password as string)

    if (!isPasswordMatched) {
        throw new AppError(httpStatus.BAD_REQUEST, "Incorrect Password")
    }

    const userTokens = createUserTokens(isUserExist)

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: pass, ...rest } = isUserExist.toObject()

    return {
        accessToken: userTokens.accessToken,
        refreshToken: userTokens.refreshToken,
        user: rest
    }

}




export const AuthServices = {
    createUser,
    credentialsLogin,
}