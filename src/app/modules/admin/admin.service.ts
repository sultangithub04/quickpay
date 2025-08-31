/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status-codes";
import AppError from "../../errorHelpers/AppError";
import { Wallet } from "../wallet/wallet.model";
import { User } from "../user/user.model";
import { Transaction } from "../transaction/transaction.model";
import { IsActive } from "../user/user.interface";
import { Types } from "mongoose";



const getUserHistory = async (userId: string) => {
    const user = await User.findById(userId);
    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, "Admin not found");
    }
    const users = await User.find({ role: { $in: ["USER", "AGENT"] } })
    const totalUser = await User.countDocuments({ role: "USER" })
    const totalAgent = await User.countDocuments({ role: "AGENT" })
    return { users, totalUser, totalAgent }
}
const getAgentHistory = async (userId: string) => {
    const user = await User.findById(userId);
    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, "Admin not found");
    }
    const users = await User.find({ role: "AGENT" })
    const totalAgent = await User.countDocuments({ role: "AGENT" })
    return { users, totalAgent }
}
const getWalletHistory = async (userId: string) => {
    const user = await User.findById(userId);
    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, "Admin not found");
    }
    const wallets = await Wallet.find().populate('user')
    const TotalWallet = await Wallet.countDocuments()
    return { wallets, TotalWallet }
}
// const getTransactionHistory = async (userId: string, page: number = 1, limit: number = 10) => {
//     // 1. Check if user exists
//     const user = await User.findById(userId);
//     if (!user) {
//         throw new AppError(httpStatus.NOT_FOUND, "User not found");
//     }

//     // 3. Calculate skip
//     const skip = (page - 1) * limit;

//     // 4. Fetch transactions with pagination
//     const transactions = await Transaction.find()
//         .sort({ createdAt: -1 }) // latest first
//         .skip(skip)
//         .limit(limit)
//         .exec();

//     // 5. Get total count for pagination info
//     const total = await Transaction.countDocuments();

//     return {
//         meta: {
//             page,
//             limit,
//             total,
//             totalPages: Math.ceil(total / limit),
//         },
//         data: transactions,
//     };
// }
// const getTransactionHistory = async (userId: string, page: number = 1, limit: number = 10) => {
//     const user = await User.findById(userId);
//     if (!user) {
//         throw new AppError(httpStatus.NOT_FOUND, "User not found");
//     }
//     const skip = (page - 1) * limit;
//     const transactions = await Transaction.find().populate("receiver sender initiatedBy", "name phone")
//         .sort({ createdAt: -1 }) // latest first
//         .skip(skip)
//         .limit(limit)
//         .exec();
//     const total = await Transaction.countDocuments();

//     return {
//         meta: {
//             page,
//             limit,
//             total,
//             totalPages: Math.ceil(total / limit),
//         },
//         data: transactions,
//     };
// }

// const getTransactionHistory = async (
//     userId: string,
//     page: number = 1,
//     limit: number = 10,
//     filters: any = {}
// ) => {
//     // Check if user exists
//     const user = await User.findById(userId);
//     if (!user) {
//         throw new AppError(httpStatus.NOT_FOUND, "User not found");
//     }

//     const skip = (page - 1) * limit;

//     // 🔹 Build dynamic filter query
//     const query: any = {};

//     if (filters.category) {
//         query.type = filters.category; // যেমন: CASH_IN, SEND_MONEY
//     }

//     if (filters.status) {
//         query.status = filters.status; // যেমন: PENDING, SUCCESS, FAILED
//     }

//     if (filters.minAmount || filters.maxAmount) {
//         query.amount = {};
//         if (filters.minAmount) query.amount.$gte = Number(filters.minAmount);
//         if (filters.maxAmount) query.amount.$lte = Number(filters.maxAmount);
//     }

//     if (filters.search) {
        
//         query.$or = [
//             { "sender.name": { $regex: filters.search, $options: "i" } },
//             { "receiver.name": { $regex: filters.search, $options: "i" } },
//         ];
//     }


//     // 🔹 Fetch transactions
//     const transactions = await Transaction.find(query)
//         .populate("receiver sender initiatedBy", "name phone")
//         .sort({ createdAt: -1 })
//         .skip(skip)
//         .limit(limit)
//         .exec();

//     const total = await Transaction.countDocuments(query);

//     return {
//         meta: {
//             page,
//             limit,
//             total,
//             totalPages: Math.ceil(total / limit),
//         },
//         data: transactions,
//     };
// };

const getTransactionHistory = async (
  userId: string,
  page: number = 1,
  limit: number = 10,
  filters: any = {}
) => {
  // Check if user exists
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  const skip = (page - 1) * limit;

  // 🔹 Build dynamic match query
  const match: any = {};

  if (filters.category) {
    match.type = filters.category; // যেমন: CASH_IN, SEND_MONEY
  }

  if (filters.status) {
    match.status = filters.status; // যেমন: PENDING, SUCCESS, FAILED
  }

  if (filters.minAmount || filters.maxAmount) {
    match.amount = {};
    if (filters.minAmount) match.amount.$gte = Number(filters.minAmount);
    if (filters.maxAmount) match.amount.$lte = Number(filters.maxAmount);
  }

  // 🔹 Aggregation pipeline
  const pipeline: any[] = [
    { $match: match },

    // Join sender
    {
      $lookup: {
        from: "users",
        localField: "sender",
        foreignField: "_id",
        as: "sender"
      }
    },
    { $unwind: { path: "$sender", preserveNullAndEmptyArrays: true } },

    // Join receiver
    {
      $lookup: {
        from: "users",
        localField: "receiver",
        foreignField: "_id",
        as: "receiver"
      }
    },
    { $unwind: { path: "$receiver", preserveNullAndEmptyArrays: true } },

    // Join initiatedBy
    {
      $lookup: {
        from: "users",
        localField: "initiatedBy",
        foreignField: "_id",
        as: "initiatedBy"
      }
    },
    { $unwind: { path: "$initiatedBy", preserveNullAndEmptyArrays: true } },
  ];

  // 🔹 Search filter (by name / phone)
  if (filters.search) {
    pipeline.push({
      $match: {
        $or: [
          { "sender.name": { $regex: filters.search, $options: "i" } },
          { "receiver.name": { $regex: filters.search, $options: "i" } },
          { "sender.phone": { $regex: filters.search, $options: "i" } },
          { "receiver.phone": { $regex: filters.search, $options: "i" } },
        ]
      }
    });
  }

  // 🔹 Sort, Pagination
  pipeline.push(
    { $sort: { createdAt: -1 } },
    { $skip: skip },
    { $limit: limit }
  );

  // Fetch data
  const transactions = await Transaction.aggregate(pipeline);

  // Total count (without pagination)
  const countPipeline = [...pipeline];
  countPipeline.pop(); // remove limit
  countPipeline.pop(); // remove skip
  countPipeline.pop(); // remove sort
  countPipeline.push({ $count: "total" });

  const totalResult = await Transaction.aggregate(countPipeline);
  const total = totalResult.length > 0 ? totalResult[0].total : 0;

  return {
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
    data: transactions,
  };
};

const blockWallet = async (userId: Types.ObjectId) => {
    const wallet = await Wallet.findOneAndUpdate({ user: userId }, { isBlocked: true }, { new: true });
    if (!wallet) throw new AppError(404, "Wallet not found");
    return wallet
}
const unBlockWallet = async (userId: Types.ObjectId) => {
    const wallet = await Wallet.findOneAndUpdate({ user: userId }, { isBlocked: false }, { new: true });
    if (!wallet) throw new AppError(404, "Wallet not found");
    return wallet
}
const aproveAgent = async (userId: string) => {
    const wallet = await User.findOneAndUpdate({ phone: userId }, { isActive: IsActive.ACTIVE }, { new: true });
    if (!wallet) throw new AppError(404, "Wallet not found");
    return wallet
}
const deleteUserService = async (_id: string) => {
    const result = await User.deleteOne({ _id });
    if (result.deletedCount === 0) {
        throw new AppError(404, "User not found");
    }
    return result
}


const getOverView = async (userId: string) => {
    const user = await User.findById(userId);
    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, "Admin not found");
    }
    const totalUser = await User.countDocuments({ role: "USER" })
    const totalAgent = await User.countDocuments({ role: "AGENT" })
    const totaltransaction = await Transaction.countDocuments();
    const result = await Transaction.aggregate([
        {
            $group: {
                _id: null,
                totalVolume: { $sum: "$amount" },
            },
        },
    ]);

    const totalVolume = result.length > 0 ? result[0].totalVolume : 0;
    return { totalUser, totalAgent, totaltransaction, totalVolume }
}



export const adminServices = {
    getUserHistory, getAgentHistory, getOverView,
    getWalletHistory, getTransactionHistory, blockWallet, unBlockWallet, aproveAgent, deleteUserService
}



