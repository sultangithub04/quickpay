import { IUser } from "../../app/modules/user/user.interface";


declare global {
  namespace Express {
    interface Request {
      user?: IUser; // বা শুধু needed fields যেমন: { id: string; role: string }
    }
  }
}
