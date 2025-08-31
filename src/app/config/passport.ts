import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { User } from "../modules/user/user.model";
import bcryptjs from "bcryptjs";


passport.use(
    new LocalStrategy({
        usernameField:"phone",
        passwordField: "password"
    }, async (phone: string, password: string, done) => {
        try {
            const isUserExist = await User.findOne({ phone })

            if (!isUserExist) {
               return done(null, false, {message: "user does not exist"})
            }
            if (!isUserExist.isVerify) {
               return done(null, false, {message: "user does not verify"})
            }

            const isPasswordMatched = await bcryptjs.compare(password as string, isUserExist.password as string)
    
           if (!isPasswordMatched) {
                return done(null, false, { message: "Password does not match" })
            }

            // const userTokens = createUserTokens(isUserExist)
            done (null, isUserExist)

            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { password: pass, ...rest } = isUserExist.toObject()
        } catch (error) {
            console.log(error);
            done(error)
        }
    }
    )
)

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