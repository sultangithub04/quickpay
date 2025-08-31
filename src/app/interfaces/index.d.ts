// import { JwtPayload } from "jsonwebtoken";


// declare global {
//     namespace Express {
//         interface Request {
//             user?: JwtPayload
//         }
//     }
// }

import { JwtPayload } from "jsonwebtoken";

declare global {
  namespace Express {
    interface UserPayload extends JwtPayload {
      userId: string;
      role: string;
      email: string;
    }

    interface Request {
      user?: UserPayload;
    }
  }
}
