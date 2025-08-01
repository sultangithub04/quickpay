# 💰 Digital Wallet System

A secure and scalable digital wallet system that supports user registration, authentication, money transfers, top-ups, transaction history, admin management, and more.

---

## 📘 Project Overview

This digital wallet system allows users to:

- Add funds (top-up)
- Send money to other users
- Withdraw (cash out)
- View transaction history

Admins can:

- View all users, wallets, and transactions
- Block/unblock wallets
- Approve/suspend agents
- Set transaction fees or system parameters

Built using RESTful API principles, the system is powered by TypeScript, Express.js, and MongoDB.

---

## 🚀 Features

### 🧑‍💼 User Features
- Register and login using phone number & password
- JWT-based authentication
- Top-up balance
- Send money to others
- View own transaction history (paginated)

### 🧑‍🔧 Admin Features
- View all users/agents/wallets/transactions
- Block or unblock wallets
- Approve or suspend agents
- Set global fees and parameters (e.g., commission)

### 💼 Wallet & Transaction Logic
- Secure wallet balances
- Validations: balance check, user existence, wallet block status
- Automatic transaction record creation
- Support for multiple transaction types (send, top-up, cash-out)

---

## ⚙️ Tech Stack

| Technology     | Description                         |
|----------------|-------------------------------------|
| Node.js        | Server-side runtime                 |
| Express.js     | Web framework                       |
| TypeScript     | Typed JavaScript                    |
| MongoDB        | NoSQL database                      |
| Mongoose       | ODM for MongoDB                     |
| Zod            | Schema validation                   |
| JWT            | Authentication                      |
| dotenv         | Environment variable management     |

---

## 📡 API Endpoints

### 🔐 Auth Routes
| Method | Endpoint              | Description             |
|--------|------------------------|-------------------------|
| POST   | `/auth/register`      | Register a new user     |
| POST   | `/auth/login`         | Login and receive token |
| POST   | `/auth/logout`        | Logout and remove token |

---

### 👤 User Routes
| Method | Endpoint                   | Description                   |
|--------|----------------------------|-------------------------------|
| GET    | `/users/me`                | Get logged-in user info       |
| PATCH  | `/users/update`            | Update user profile           |

---

### 💳 Wallet Routes
| Method | Endpoint                   | Description                            |
|--------|----------------------------|----------------------------------------|
| GET    | `/wallets/me`              | View logged-in user's wallet           |


---

### 📄 Transaction Routes
| Method | Endpoint                   | Description                          |
|--------|----------------------------|--------------------------------------|
| PATCH  | `/transactions/topup`      | Top-up balance                       |
| PATCH  | `/transactions/withdraw`   | withdraw balance                     |
| PATCH  | `/transactions/send`       | Send money to another user           |
| PATCH  | `/transactions/cash-in`    | Cash in to  agent                    |
| PATCH  | `/transactions/cash-out`   | Cash out from agent                  |
| GET    | `/transactions/me`         | Get own transactions  info           |
---

### 🛠️ Admin Routes
| Method | Endpoint                           | Description                        |
|--------|------------------------------------|------------------------------------|
| GET    | `/admin/users`                     | View all users                     |
| GET    | `/admin/agents`                    | View all agents                    |
| GET    | `/admin/wallets`                   | View all wallets                   |
| GET    | `/admin/transactions`              | View all transactions              |
| PATCH  | `/admin/wallets/block/:walletId`   | Block a wallet                     |
| PATCH  | `/admin/wallets/unblock/:walletId` | Unblock a wallet                   |
| PATCH  | `/admin/agents/approve/:id`        | Approve an agent                   |
| PATCH  | `/admin/system-settings`           | Set fees, commission, limits       |

---


## 🛡️ Security & Validation
- JWT-based route protection
- Role-based access control (ADMIN, AGENT, USER)
- Input validation using `Zod`
- Error handling middleware

---

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
