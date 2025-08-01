import { IUser } from "./user.interface"
import { User } from "./user.model";
import httpStatus from "http-status-codes";
import bcryptjs from "bcryptjs";
import AppError from "../../errorHelpers/AppError";
import { envVars } from "../../config/env";
import { Wallet } from "../wallet/wallet.model";
const createUser = async (payload: Partial<IUser>) => {
    if(payload.role==="ADMIN"){
    throw new AppError(httpStatus.BAD_REQUEST, "Unathorioze  Access")
    }
    console.log(payload);
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

    return {user, wallet}

}




export const UserServices = {
    createUser,
}