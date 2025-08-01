import httpStatus from "http-status-codes";
import AppError from "../../errorHelpers/AppError";
import { Wallet } from "../wallet/wallet.model";
import { ITransaction } from "./transaction.interface";
import { User } from "../user/user.model";
import { Transaction } from "./transaction.model";
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
const createHistory = async (userId: string) => {

  // 1. Check if user exists
  const user = await User.findById(userId);
  // console.log(user);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }
  // console.log("user", user);

  // // 2. Get the user's wallet
  // const getWallet = await Wallet.findOne({ user: userId });
  // // console.log("sender www",senderWallet);
  // if (!getWallet) {
  //   throw new AppError(httpStatus.NOT_FOUND, "Wallet not found");
  // }

  // Filter: Show transactions where user is sender or receiver or initiatedBy
  const filter = {
    $or: [
      { sender: userId },
      { receiver: userId },
      { initiatedBy: userId }
    ]
  };

  const transactions = await Transaction.find(filter)
    .sort({ createdAt: -1 })
    .exec();

  const total = await Transaction.countDocuments(filter);

  return { transactions, total }
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


  senderWallet.balance += amount;
  receiverWallet.balance -= amount;

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




export const TransactionServices = {
  createTopUpMoney, createWithdrawMoney, createSendMoney, createCashIn, createCashout, createHistory
}



