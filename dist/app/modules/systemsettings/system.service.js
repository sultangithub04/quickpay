"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingServices = void 0;
const system_model_1 = require("./system.model");
const createSetting = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield system_model_1.SystemSetting.create(payload);
    return user;
});
// const updateUser = async (userId: string, payload: Partial<IUser>, decodedToken: JwtPayload) => {
//     const ifUserExist = await User.findById(userId);
//     if (!ifUserExist) {
//         throw new AppError(httpStatus.NOT_FOUND, "User Not Found")
//     }
//     /**
//      * email - can not update
//      * name, phone, password address
//      * password - re hashing
//      *  only admin superadmin - role, isDeleted...
//      * 
//      * promoting to superadmin - superadmin
//      */
//     if (payload.role) {
//         if (decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE) {
//             throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
//         }
//         if (payload.role === Role.SUPER_ADMIN && decodedToken.role === Role.ADMIN) {
//             throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
//         }
//     }
//     if (payload.isActive || payload.isDeleted || payload.isVerified) {
//         if (decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE) {
//             throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
//         }
//     }
//     if (payload.password) {
//         payload.password = await bcryptjs.hash(payload.password, envVars.BCRYPT_SALT_ROUND)
//     }
//     const newUpdatedUser = await User.findByIdAndUpdate(userId, payload, { new: true, runValidators: true })
//     return newUpdatedUser
// }
// const getAllUsers = async () => {
//     const users = await User.find({});
//     const totalUsers = await User.countDocuments();
//     return {
//         data: users,
//         meta: {
//             total: totalUsers
//         }
//     }
// };
exports.SettingServices = {
    createSetting
};
