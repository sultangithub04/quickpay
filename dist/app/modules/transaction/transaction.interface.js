"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionType = void 0;
// export type TransactionType =
//   | 'add_money'
//   | 'withdraw'
//   | 'send'
//   | 'cash_in'
//   | 'cash_out';
var TransactionType;
(function (TransactionType) {
    TransactionType["add_money"] = "add_money";
    TransactionType["withdraw"] = "withdraw";
    TransactionType["send_money"] = "send";
    TransactionType["cash_in"] = "cash_in";
    TransactionType["cash_out"] = "cash_out";
})(TransactionType || (exports.TransactionType = TransactionType = {}));
