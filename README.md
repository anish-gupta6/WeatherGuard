# WeatherGuard

WeatherGuard is a comprehensive weather alert platform that pushes secure, invite-only, hourly weather forecasts straight to your Telegram. It features a scalable Node.js backend using NestJS and a responsive React frontend powered by Vite and TailwindCSS.

## Project Structure

This repository is organized into two main parts:

- **`api/`** - The NestJS backend application.
- **`frontend/`** - The React + Vite frontend application.

## System Design

### Database Schema
WeatherGuard utilizes MongoDB as its primary database. The core entity in our system is the `User`, managed via Mongoose.

**User Collection (`users`)**
| Field | Type | Attributes | Description |
|---|---|---|---|
| `_id` | ObjectId | Auto-generated | Unique identifier |
| `email` | String | Required, Unique | User's email address |
| `oauthId` | String | Required, Unique | Google OAuth ID |
| `name` | String | Required | Full name of the user |
| `city` | String | Optional | Target city for weather alerts |
| `role` | Enum | Default: `USER` | `SUPER_ADMIN`, `ADMIN`, or `USER` |
| `status` | Enum | Default: `PENDING` | `PENDING`, `APPROVED`, `REJECTED`, or `REVOKED` |
| `telegramChatId` | String | Optional | ID linked to the user's Telegram chat |
| `hashedRefreshToken`| String | Optional | Stored hash of the JWT refresh token |
| `createdAt` | Date | Auto-generated | Timestamp of creation |
| `updatedAt` | Date | Auto-generated | Timestamp of last update |

## Data Flow: Alerting Mechanism

To ensure only explicitly **Approved** users receive automated weather alerts, WeatherGuard strictly adheres to a gatekept data flow:

1. **Registration (Pending State):** When a user first logs in via Google Auth, they are assigned the `USER` role and `PENDING` status.
2. **Admin Verification:** An `ADMIN` or `SUPER_ADMIN` logs into the Admin Dashboard to review the user.
3. **Approval:** The admin changes the user's status to `APPROVED`.
4. **Onboarding & Location:** The newly approved user provides their target `city`.
5. **Telegram Linking:** The user connects their Telegram account, generating a valid `telegramChatId`.
6. **Hourly Alert Dispatching:** 
   - A server-side CRON job runs every hour.
   - It queries the database exclusively for users where `status === 'APPROVED'`, `role === 'USER'`, and `telegramChatId` exists.
   - The weather API fetches forecasts for each user's specified `city`.
   - The payload is dispatched to Telegram.

This design prevents unauthorized actors or revoked/rejected users from consuming API rate limits or receiving privileged data.

## Setup & Installation

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/) (v9 or higher recommended)
- A MongoDB instance (local or Atlas)
- Google OAuth credentials (Client ID and Secret)
- Telegram Bot Token

### 1. Clone the repository
```bash
git clone https://github.com/anish-gupta6/WeatheGuard/
cd WeatherGuard
```

### 2. Backend Setup (`api/`)
Navigate to the `api` directory and install the dependencies:
```bash
cd api
npm install
```

Create a `.env` file in the `api/` directory:
```env
# Example .env configuration
MONGO_URI=mongodb://localhost:27017/weatherguard
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
FRONTEND_URL=http://localhost:5173
```

To seed the initial super admin account, run:
```bash
npm run seed:admin -- <your-google-email>
```

Start the development server:
```bash
npm run start:dev
```

### 3. Frontend Setup (`frontend/`)
Navigate to the `frontend` directory and install the dependencies:
```bash
cd ../frontend
npm install
```

Create a `.env` file in the `frontend/` directory:
```env
# Example .env configuration
VITE_API_URL=http://localhost:3000
```

Start the frontend development server:
```bash
npm run dev
```

## Features

- **Invite-Only Access**: Secure access system where new users must be approved by an administrator before they can use the platform.
- **Admin Dashboard**: A comprehensive dashboard to manage users, approve/reject access requests, and track pending invitations.
- **Super Admin Support**: Dedicated super admin capabilities for managing other system administrators.
- **Google Authentication**: Seamless and secure sign-in using Google OAuth.
- **Telegram Integration**: Direct integration with Telegram to push hourly, localized weather forecasts to users based on their selected city.
- **Responsive Design**: A sleek, dark-themed responsive UI for both the administrative portal and onboarding flows.

## Tech Stack

**Frontend:**
- React 18 (TypeScript)
- Vite
- TailwindCSS
- React Router DOM
- Lucide React (Icons)

**Backend:**
- Node.js (TypeScript)
- NestJS
- MongoDB / Mongoose
- JWT Authentication
- Google Auth Library
- Telegraf (Telegram Bot API)

## License

This project is licensed under the MIT License.
