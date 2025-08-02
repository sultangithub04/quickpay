# 💸 QuickPay – Digital Wallet System

A robust agent-based digital wallet system that enables users to **cash in**, **cash out**, **send money**, and **top up** balances, while giving **admin full control** over wallets, agents, and transaction parameters like commission and fee rates.

---

## 🚀 Project Overview

QuickPay is a wallet-based transaction platform built for sending, receiving, and managing digital funds between users and agents. The system supports real-time wallet updates, commission tracking, user management, and admin controls like blocking/unblocking wallets or adjusting system-level settings.

---

## ✨ Features

- 👤 User registration & login (via phone)
- 🪙 Wallet top-up, cash-in, cash-out, send money
- 📜 Transaction history
- 💼 Agent approval/suspension
- 🛡️ Admin controls over users, agents, wallets
- 📈 Configurable fees, commissions, and minimum balance
- 🔐 Role-based authorization (Admin, Agent, User)

---

## ⚙️ Tech Stack

| Layer         | Technology                  |
|---------------|-----------------------------|
| Backend       | Node.js, Express.js         |
| Database      | MongoDB + Mongoose          |
| Auth & Roles  | JWT, Role-based middleware  |
| Hosting       | Vercel                      |
| API Testing   | Postman / Thunder Client    |

---

## 📌 API Endpoints

### 🔐 Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/v1/auth/register` | Register new user |
| `POST` | `/api/v1/auth/login`    | User login (phone + password) |
| `POST` | `/api/v1/auth/logout`   | Logout and clear token |

---

### 👤 User

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET`  | `/api/v1/users/me`      | Get currently logged-in user's info |
| `PATCH`| `/api/v1/users/update`  | Update name, email, phone, role |

---

### 💰 Transactions

| Method | Endpoint | Description |
|--------|----------|-------------|
| `PATCH` | `/api/v1/transactions/topup`     | Top up own wallet (admin only) |
| `PATCH` | `/api/v1/transactions/withdraw`  | Withdraw from own wallet |
| `PATCH` | `/api/v1/transactions/send`      | Send money to another user |
| `PATCH` | `/api/v1/transactions/cash-in`   | Cash in (user → agent) |
| `PATCH` | `/api/v1/transactions/cash-out`  | Cash out (agent → user) |
| `GET`   | `/api/v1/transactions/me`        | View personal transaction history (paginated) |

---

### 👛 Wallet

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET`  | `/api/v1/wallets/me`  | View logged-in user's wallet |

---

### 🛠️ Admin

#### Users / Agents / Wallets / Transactions
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET`  | `/api/v1/admin/users`        | Get all users |
| `GET`  | `/api/v1/admin/agents`       | Get all agents |
| `GET`  | `/api/v1/admin/wallets`      | Get all wallets |
| `GET`  | `/api/v1/admin/transactions` | Get all transactions |

#### Control Actions

| Method | Endpoint | Description |
|--------|----------|-------------|
| `PATCH` | `/api/v1/admin/wallets/block/:phone`     | Block wallet by phone |
| `PATCH` | `/api/v1/admin/wallets/unblock/:phone`   | Unblock wallet |
| `PATCH` | `/api/v1/admin/agents/approve/:phone`    | Approve agent by phone |

---

### ⚙️ System Settings

| Method | Endpoint | Description |
|--------|----------|-------------|
| `PATCH` | `/api/v1/setting/setting` | Set system settings (fee, commission, min balance) |
| `GET`   | `/api/v1/system/commission` | Get current system commission and fee settings |

---

## 🧪 Example Inputs

### ✅ Register
```json
POST /api/v1/auth/register
{
  "name": "user9",
  "email": "user1@example.com",
  "phone": "01710000105",
  "password": "12345678"
}
```
✅ Login
```json

POST /api/v1/auth/login
{
  "phone": "01710000400",
  "password": "12345678"
}

```
✅ Send Money
```json

PATCH /api/v1/transactions/send
{
  "phone": "01710000469",
  "amount": 500
}
✅ Set Admin Fees

```json

PATCH /api/v1/setting/setting
{
  "transactionFeeRate": 1.5,
  "agentCommissionRate": 2,
  "minBalance": 100
}
```
📂 Deployment
Live API Base URL:
https://quickpay-sigma.vercel.app/api/v1

## 🧪 Running the Project

```bash
# Clone the repository
git clone https://github.com/Apollo-Level2-Web-Dev/B5A5.git

# Install dependencies
npm install

# Create  environment variables
cp .env.example .env

# Run in development mode
npm run dev

```