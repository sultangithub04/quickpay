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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_local_1 = require("passport-local");
const user_model_1 = require("../modules/user/user.model");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
passport_1.default.use(new passport_local_1.Strategy({
    usernameField: "phone",
    passwordField: "password"
}, (phone, password, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const isUserExist = yield user_model_1.User.findOne({ phone });
        if (!isUserExist) {
            return done(null, false, { message: "user does not exist" });
        }
        if (!isUserExist.isVerify) {
            return done(null, false, { message: "user does not verify" });
        }
        const isPasswordMatched = yield bcryptjs_1.default.compare(password, isUserExist.password);
        if (!isPasswordMatched) {
            return done(null, false, { message: "Password does not match" });
        }
        // const userTokens = createUserTokens(isUserExist)
        done(null, isUserExist);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const _a = isUserExist.toObject(), { password: pass } = _a, rest = __rest(_a, ["password"]);
    }
    catch (error) {
        console.log(error);
        done(error);
    }
})));
// passport.use(
//     new GoogleStrategy(
//         {
//             clientID: envVars.GOOGLE_CLIENT_ID,
//             clientSecret: envVars.GOOGLE_CLIENT_SECRET,
//             callbackURL: envVars.GOOGLE_CALLBACK_URL
//         }, async (accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback) => {
//             try {
//                 const email = profile.emails?.[0].value;
//                 if (!email) {
//                     return done(null, false, { mesaage: "No email found" })
//                 }
//                 let isUserExist = await User.findOne({ email })
//                 if (isUserExist ) {
//                     // throw new AppError(httpStatus.BAD_REQUEST, "User is not verified")
//                     // done("User is not verified")
//                     return done(null, false, { message: "User is not verified" })
//                 }
//                 if (!isUserExist) {
//                     isUserExist = await User.create({
//                         email,
//                         name: profile.displayName,
//                         picture: profile.photos?.[0].value,
//                         role: Role.USER,
//                         isVerified: true,
//                         auths: [
//                             {
//                                 provider: "google",
//                                 providerId: profile.id
//                             }
//                         ]
//                     })
//                 }
//                 return done(null, isUserExist)
//             } catch (error) {
//                 console.log("Google Strategy Error", error);
//                 return done(error)
//             }
//         }
//     )
// )
