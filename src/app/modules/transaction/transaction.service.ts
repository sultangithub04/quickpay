import httpStatus from "http-status-codes";
import AppError from "../../errorHelpers/AppError";
import { Wallet } from "../wallet/wallet.model";
import { ITransaction } from "./transaction.interface";
import { User } from "../user/user.model";
import { Transaction } from "./transaction.model";
import { Role } from "../user/user.interface";
import { Commission } from "../commission/commission.model";
import { SystemSetting } from "../systemsettings/system.model";
import mongoose, { Types } from "mongoose";
const createTopUpMoney = async (userId: string, payload: Partial<ITransaction>) => {

  // 1. Check if user exists
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  // 2. Get the user's wallet
  const wallet = await Wallet.findOne({ user: userId });
  if (!wallet) {
    throw new AppError(httpStatus.NOT_FOUND, "Wallet not found");
  }
  const { amount } = payload
  // 3. Validate amount
  if (!amount || amount <= 0) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid amount");
  }


  // 4. Update wallet balance
  wallet.balance += amount;
  await wallet.save();

  // 5. Record the transaction
  const transaction = await Transaction.create({
    type: "add_money",
    amount: amount,
    sender: null,
    receiver: user._id,
    initiatedBy: user._id,
    status: "completed",
    fee: 0,
    commission: 0,
  }
  );


  return {
    transactionId: transaction._id,
    newBalance: wallet.balance,
  };
}
const createWithdrawMoney = async (userId: string, payload: Partial<ITransaction>) => {
  // 1. Check if user exists
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  // 2. Get the user's wallet
  const wallet = await Wallet.findOne({ user: userId });
  if (!wallet) {
    throw new AppError(httpStatus.NOT_FOUND, "Wallet not found");
  }

  const { amount } = payload
  // 3. Validate amount
  if (!amount || amount <= 0) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid amount");
  }


  // 4. Update wallet balance
  wallet.balance -= amount;
  await wallet.save();

  // 5. Record the transaction
  const transaction = await Transaction.create({
    type: "withdraw",
    amount: amount,
    sender: null,
    receiver: user._id,
    initiatedBy: user._id,
    status: "completed",
    fee: 0,
    commission: 0,
  }
  );


  return {
    transactionId: transaction._id,
    newBalance: wallet.balance,
  };
}
const createSendMoney = async (userId: string, payload: Partial<ITransaction>) => {

  // 1. Check if user exists
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }
  // console.log("user", user);

  // 2. Get the user's wallet
  const senderWallet = await Wallet.findOne({ user: userId });
  // console.log("sender www",senderWallet);
  if (!senderWallet) {
    throw new AppError(httpStatus.NOT_FOUND, "Wallet not found");
  }

  const { phone, amount } = payload

  const receiverUser = await User.findOne({ phone })
  // console.log(receiverUser);
  if (!receiverUser) {
    throw new AppError(httpStatus.NOT_FOUND, "Receiver user not found");
  }

  const receiverWallet = await Wallet.findOne({ user: receiverUser._id });
  if (!receiverWallet) {
    throw new AppError(httpStatus.NOT_FOUND, "Receiver wallet not found");
  }


  // 3. Validate amount
  if (!amount || amount <= 0) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid amount");
  }


  senderWallet.balance -= amount;
  receiverWallet.balance += amount;

  await senderWallet.save();
  await receiverWallet.save();



  // 5. Record the transaction
  const transaction = await Transaction.create({
    type: "send",
    amount: amount,
    sender: user._id,
    receiver: receiverUser._id,
    initiatedBy: user._id,
    status: "completed",
    fee: 0,
    commission: 0,
  }
  );


  return {
    transactionId: transaction._id,
    newBalance: senderWallet.balance,
  };
}
// check crate function


// const createCashIn = async (userId: string, payload: Partial<ITransaction>) => {
//   // 1. Check if user exists
//   const user = await User.findById(userId);
//   if (!user) throw new AppError(httpStatus.NOT_FOUND, "User not found");

//   // 2. Get sender wallet
//   const senderWallet = await Wallet.findOne({ user: userId });
//   if (!senderWallet) throw new AppError(httpStatus.NOT_FOUND, "Wallet not found");

//   const { phone, amount } = payload;
//   if (!amount || amount <= 0) throw new AppError(httpStatus.BAD_REQUEST, "Invalid amount");

//   // 3. Find receiver user and wallet
//   const receiverUser = await User.findOne({ phone });
//   if (!receiverUser) throw new AppError(httpStatus.NOT_FOUND, "Receiver user not found");

//   const receiverWallet = await Wallet.findOne({ user: receiverUser._id });
//   if (!receiverWallet) throw new AppError(httpStatus.NOT_FOUND, "Receiver wallet not found");

//   // 4. Get system settings (for commission rate)
//   const systemSettings = await SystemSetting.findOne();
//   if (!systemSettings) throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "System settings not found");

//   const commissionAmount = (amount * systemSettings.agentCommissionRate) / 100;

//   // 5. Update balances
//   senderWallet.balance -= amount;
//   receiverWallet.balance += amount;

//   // ✅ Add commission to agent (if sender is agent)
//   if (user.role === Role.AGENT) {
//     senderWallet.balance += commissionAmount; // agent earns
//   }

//   await senderWallet.save();
//   await receiverWallet.save();

//   // 6. Record the transaction
//   const transaction = await Transaction.create({
//     type: "cash-in",
//     amount,
//     sender: user._id,
//     receiver: receiverUser._id,
//     initiatedBy: user._id,
//     status: "completed",
//     fee: 0,
//     commission: commissionAmount,
//   });

//   // 7. Create commission entry if agent
//   if (user.role === Role.AGENT) {
//     await Commission.create({
//       agent: user._id,
//       transaction: transaction._id,
//       amount: commissionAmount,
//       createdAt: new Date(),
//     });
//   }

//   return {
//     transactionId: transaction._id,
//     newBalance: senderWallet.balance,
//   };
// };


const createCashIn = async (userId: string, payload: Partial<ITransaction>) => {

  // 1. Check if user exists
  const user = await User.findById(userId);
  // console.log(user);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }
  // console.log("user", user);

  // 2. Get the user's wallet
  const senderWallet = await Wallet.findOne({ user: userId });
  // console.log("sender www",senderWallet);
  if (!senderWallet) {
    throw new AppError(httpStatus.NOT_FOUND, "Wallet not found");
  }

  const { phone, amount } = payload

  const receiverUser = await User.findOne({ phone })

  if (!receiverUser) {
    throw new AppError(httpStatus.NOT_FOUND, "Receiver user not found");
  }

  const receiverWallet = await Wallet.findOne({ user: receiverUser._id });
  if (!receiverWallet) {
    throw new AppError(httpStatus.NOT_FOUND, "Receiver wallet not found");
  }


  // 3. Validate amount
  if (!amount || amount <= 0) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid amount");
  }
  // 4. Get system settings (for commission rate)
  const systemSettings = await SystemSetting.findOne();
  if (!systemSettings) throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "System settings not found");

  const commissionAmount = (amount * systemSettings.agentCommissionRate) / 100;
  console.log(commissionAmount);

  senderWallet.balance -= amount;
  receiverWallet.balance += amount;


  //  Add commission to agent (if sender is agent)
  if (user.role === Role.AGENT) {
    senderWallet.balance += commissionAmount; // agent earns
  }

  await senderWallet.save();
  await receiverWallet.save();

  // 5. Record the transaction
  const transaction = await Transaction.create({
    type: "cash_in",
    amount: amount,
    sender: user._id,
    receiver: receiverUser._id,
    initiatedBy: user._id,
    status: "completed",
    fee: 0,
    commission: commissionAmount,
  }
  );

  if (user.role === Role.AGENT) {
    await Commission.create({
      agent: user._id,
      transaction: transaction._id,
      amount: commissionAmount,
      createdAt: new Date(),
    });
  }

  return {
    transactionId: transaction._id,
    newBalance: senderWallet.balance,
  };
}
const createCashout = async (userId: string, payload: Partial<ITransaction>) => {

  // 1. Check if user exists
  const user = await User.findById(userId);
  // console.log(user);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }
  // console.log("user", user);

  // 2. Get the user's wallet
  const senderWallet = await Wallet.findOne({ user: userId });
  // console.log("sender www",senderWallet);
  if (!senderWallet) {
    throw new AppError(httpStatus.NOT_FOUND, "Wallet not found");
  }

  const { phone, amount } = payload

  const receiverUser = await User.findOne({ phone })

  if (!receiverUser) {
    throw new AppError(httpStatus.NOT_FOUND, "Receiver user not found");
  }

  const receiverWallet = await Wallet.findOne({ user: receiverUser._id });
  if (!receiverWallet) {
    throw new AppError(httpStatus.NOT_FOUND, "Receiver wallet not found");
  }


  // 3. Validate amount
  if (!amount || amount <= 0) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid amount");
  }
  // 4. Get system settings (for commission rate)
  const systemSettings = await SystemSetting.findOne();
  if (!systemSettings) throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "System settings not found");

  const commissionAmount = (amount * systemSettings.agentCommissionRate) / 100;
  console.log(commissionAmount);

  senderWallet.balance += amount;
  receiverWallet.balance -= amount;


  //  Add commission to agent (if sender is agent)
  if (user.role === Role.AGENT) {
    senderWallet.balance += commissionAmount; // agent earns
  }

  await senderWallet.save();
  await receiverWallet.save();

  // 5. Record the transaction
  const transaction = await Transaction.create({
    type: "cash_out",
    amount: amount,
    sender: user._id,
    receiver: receiverUser._id,
    initiatedBy: user._id,
    status: "completed",
    fee: 0,
    commission: commissionAmount,
  }
  );

  if (user.role === Role.AGENT) {
    await Commission.create({
      agent: user._id,
      transaction: transaction._id,
      amount: commissionAmount,
      createdAt: new Date(),
    });
  }

  return {
    transactionId: transaction._id,
    newBalance: senderWallet.balance,
  };
}
// const createHistory = async (userId: string) => {

//   // 1. Check if user exists
//   const user = await User.findById(userId);
//   // console.log(user);
//   if (!user) {
//     throw new AppError(httpStatus.NOT_FOUND, "User not found");
//   }
//   // console.log("user", user);

//   // // 2. Get the user's wallet
//   // const getWallet = await Wallet.findOne({ user: userId });
//   // // console.log("sender www",senderWallet);
//   // if (!getWallet) {
//   //   throw new AppError(httpStatus.NOT_FOUND, "Wallet not found");
//   // }

//   // Filter: Show transactions where user is sender or receiver or initiatedBy
//   const filter = {
//     $or: [
//       { sender: userId },
//       { receiver: userId },
//       { initiatedBy: userId }
//     ]
//   };

//   const transactions = await Transaction.find(filter)
//     .sort({ createdAt: -1 })
//     .exec();

//   const total = await Transaction.countDocuments(filter);

//   return { transactions, total }
// }

const createHistory = async (userId: string, page = 1, limit = 10) => {
  // 1. Check if user exists
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  // 2. Get user wallet for opening balance
  const wallet = await Wallet.findOne({ user: userId });
  if (!wallet) {
    throw new AppError(httpStatus.NOT_FOUND, "Wallet not found");
  }

  // 3. Fetch ALL transactions (no pagination yet)
  const allTransactions = await Transaction.find({
    $or: [
      { sender: userId },
      { receiver: userId },
      { initiatedBy: userId },
    ],
  })
    .sort({ createdAt: 1 }) // oldest → newest
    .lean();

  // 4. Start running balance from 0 (or from earliest historical balance if you keep snapshots)
  let runningBalance = 50;
  const statementFull = allTransactions.map((tx) => {
    let debit = 0;
    let credit = 0;

    if (tx.type === "cash_in" && String(tx.receiver) === userId) {
      credit = tx.amount;
      runningBalance += tx.amount;
    } else if (tx.type === "add_money" && String(tx.initiatedBy) === userId) {
      credit = tx.amount;
      runningBalance += tx.amount;
    }else if (tx.type === "cash_out" && String(tx.receiver|| tx.initiatedBy) === userId ||tx.sender) {
      debit = tx.amount;
      runningBalance -= tx.amount;
    } else if (tx.type === "withdraw" && String(tx.initiatedBy || tx.receiver||tx.sender) === userId) {
      debit = tx.amount;
      runningBalance -= tx.amount;
    } else if (tx.type === "send") {
      if (String(tx.sender) === userId) {
        debit = tx.amount;
        runningBalance -= tx.amount;
      } else if (String(tx.receiver) === userId) {
        credit = tx.amount;
        runningBalance += tx.amount;
      }
    }

    return {
      date: tx.createdAt,
      type: tx.type,
      debit,
      credit,
      balance: runningBalance,
    };
  });

  // 5. Paginate AFTER running balance is built
  const total = statementFull.length;
  const paginated = statementFull.slice((page - 1) * limit, page * limit);

  return {
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
    data: paginated,
  };
};
const createAgentHistory = async (userId: string, page = 1, limit = 10) => {
  // 1. Check if user exists
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "Agent not found");
  }

  // 2. Get user wallet for opening balance
  const wallet = await Wallet.findOne({ user: userId });
  if (!wallet) {
    throw new AppError(httpStatus.NOT_FOUND, "Wallet not found");
  }

  // 3. Fetch ALL transactions (no pagination yet)
  const allTransactions = await Transaction.find({
    $or: [
      { sender: userId },
      { receiver: userId },
      { initiatedBy: userId },
    ],
  })
    .sort({ createdAt: 1 }) // oldest → newest
    .lean();

  // 4. Start running balance from 0 (or from earliest historical balance if you keep snapshots)
  let runningBalance = 50;
  const statementFull = allTransactions.map((tx) => {
    let debit = 0;
    let credit = 0;

    if (tx.type === "cash_out" && String(tx.initiatedBy) === userId) {
      credit = tx.amount;
      runningBalance += tx.amount;
    } else if (tx.type === "add_money" && String(tx.initiatedBy) === userId) {
      debit = tx.amount;
      runningBalance -= tx.amount;
    }
    
    else if (tx.type === "cash_in" && String(tx.receiver|| tx.initiatedBy) === userId ||tx.sender) {
      debit = tx.amount;
      runningBalance -= tx.amount;
    } 
    else if (tx.type === "withdraw" && String(tx.initiatedBy || tx.receiver||tx.sender) === userId) {
      debit = tx.amount;
      runningBalance += tx.amount;
    } else if (tx.type === "send") {
      if (String(tx.sender) === userId) {
        debit = tx.amount;
        runningBalance += tx.amount;
      } else if (String(tx.receiver) === userId) {
        credit = tx.amount;
        runningBalance -= tx.amount;
      }
    }


    return {
      date: tx.createdAt,
      type: tx.type,
      debit,
      credit,
      balance: runningBalance,
    };
  });

  // 5. Paginate AFTER running balance is built
  const total = statementFull.length;
  const paginated = statementFull.slice((page - 1) * limit, page * limit);

  return {
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
    data: paginated,
  };
};

// const createHistory = async (userId: string, page = 1, limit = 10) => {
//   const uid = new Types.ObjectId(userId);

//   // 1. Get wallet
//   const wallet = await Wallet.findOne({ user: uid });
//   if (!wallet) {
//     throw new Error("Wallet not found for this user");
//   }

//   // 2. Get all transactions for the user (for balance history)
//   const allTransactions = await Transaction.find({
//     $or: [{ sender: uid }, { receiver: uid }, { initiatedBy: uid }],
//   })
//     .sort({ createdAt: 1 }) // oldest → newest (to calculate balance correctly)
//     .lean();

//   // 3. Start running balance from the first record
//   let runningBalance = 50;

//   const statementFull = allTransactions.map((tx) => {
//     let debit = 0;
//     let credit = 0;

//     if (tx.type === "cash_in" && String(tx.receiver) === userId) {
//       credit = tx.amount;
//       runningBalance += tx.amount;
//     }
//     else if (tx.type === "add_money" && String(tx.receiver) === userId) {
//       credit = tx.amount;
//       runningBalance -= tx.amount;
//     }



//     else if (tx.type === "withdraw" && String(tx.receiver) === userId) {
//       debit = tx.amount;
//       runningBalance -= tx.amount;
//     } else if (tx.type === "send") {
//       if (String(tx.sender) === userId) {
//         debit = tx.amount;
//         runningBalance -= tx.amount;
//       } else if (String(tx.receiver) === userId) {
//         credit = tx.amount;
//         runningBalance += tx.amount;
//       }
//     }

//     return {
//       date: tx.createdAt,
//       type: tx.type,
//       debit,
//       credit,
//       balance: runningBalance,
//     };
//   });

//   // 4. Apply pagination (latest first for user view)
//   const paginated = statementFull.reverse().slice((page - 1) * limit, page * limit);

//   return {
//     meta: {
//       page,
//       limit,
//       total: statementFull.length,
//       totalPages: Math.ceil(statementFull.length / limit),
//     },
//     data: paginated,
//   };
// };


const createCashoutUser = async (userId: string, payload: Partial<ITransaction>) => {

  // 1. Check if user exists
  const user = await User.findById(userId);
  // console.log(user);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }
  // console.log("user", user);

  // 2. Get the user's wallet
  const senderWallet = await Wallet.findOne({ user: userId });
  // console.log("sender www",senderWallet);
  if (!senderWallet) {
    throw new AppError(httpStatus.NOT_FOUND, "Wallet not found");
  }

  const { phone, amount } = payload

  const receiverUser = await User.findOne({ phone })

  if (!receiverUser) {
    throw new AppError(httpStatus.NOT_FOUND, "Receiver user not found");
  }

  const receiverWallet = await Wallet.findOne({ user: receiverUser._id });
  if (!receiverWallet) {
    throw new AppError(httpStatus.NOT_FOUND, "Receiver wallet not found");
  }


  // 3. Validate amount
  if (!amount || amount <= 0) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid amount");
  }
  // 4. Get system settings (for commission rate)
  const systemSettings = await SystemSetting.findOne();
  if (!systemSettings) throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "System settings not found");

  const commissionAmount = (amount * systemSettings.agentCommissionRate) / 100;
  console.log(commissionAmount);

  senderWallet.balance -= amount;
  receiverWallet.balance += amount;


  //  Add commission to agent (if sender is agent)


  await senderWallet.save();
  await receiverWallet.save();

  // 5. Record the transaction
  const transaction = await Transaction.create({
    type: "withdraw",
    amount: amount,
    sender: user._id,
    receiver: receiverUser._id,
    initiatedBy: user._id,
    status: "completed",
    fee: 0,
    commission: commissionAmount,
  }
  );

  if (user.role === Role.AGENT) {
    await Commission.create({
      agent: user._id,
      transaction: transaction._id,
      amount: commissionAmount,
      createdAt: new Date(),
    });
  }

  return {
    transactionId: transaction._id,
    newBalance: senderWallet.balance,
  };
}

const createCashInUser = async (userId: string, payload: Partial<ITransaction>) => {

  // 1. Check if user exists
  const user = await User.findById(userId);
  // console.log(user);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }
  // console.log("user", user);

  // 2. Get the user's wallet
  const senderWallet = await Wallet.findOne({ user: userId });
  // console.log("sender www",senderWallet);
  if (!senderWallet) {
    throw new AppError(httpStatus.NOT_FOUND, "Wallet not found");
  }

  const { phone, amount } = payload

  const receiverUser = await User.findOne({ phone })

  if (!receiverUser) {
    throw new AppError(httpStatus.NOT_FOUND, "Receiver user not found");
  }

  const receiverWallet = await Wallet.findOne({ user: receiverUser._id });
  if (!receiverWallet) {
    throw new AppError(httpStatus.NOT_FOUND, "Receiver wallet not found");
  }


  // 3. Validate amount
  if (!amount || amount <= 0) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid amount");
  }
  // 4. Get system settings (for commission rate)
  const systemSettings = await SystemSetting.findOne();
  if (!systemSettings) throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "System settings not found");

  const commissionAmount = (amount * systemSettings.agentCommissionRate) / 100;


  senderWallet.balance += amount;
  receiverWallet.balance -= amount;


  //  Add commission to agent (if sender is agent)


  await senderWallet.save();
  await receiverWallet.save();

  // 5. Record the transaction
  const transaction = await Transaction.create({
    type: "add_money",
    amount: amount,
    sender: user._id,
    receiver: receiverUser._id,
    initiatedBy: user._id,
    status: "completed",
    fee: 0,
    commission: commissionAmount,
  }
  );

  if (user.role === Role.AGENT) {
    await Commission.create({
      agent: user._id,
      transaction: transaction._id,
      amount: commissionAmount,
      createdAt: new Date(),
    });
  }

  return {
    transactionId: transaction._id,
    newBalance: senderWallet.balance,
  };
}
export const TransactionServices = {
  createCashInUser, createTopUpMoney, createWithdrawMoney, createSendMoney, createCashIn, createCashout, createHistory, createCashoutUser, createAgentHistory
}



