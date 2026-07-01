# WeatherGuard

WeatherGuard is a comprehensive weather alert platform that pushes secure, invite-only, hourly weather forecasts straight to your Telegram. It features a scalable Node.js backend using NestJS and a responsive React frontend powered by Vite and TailwindCSS.

## Project Structure

This repository is organized into two main parts:

- **`api/`** - The NestJS backend application.
- **`frontend/`** - The React + Vite frontend application.

## Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/) (v9 or higher recommended)
- A MongoDB instance (local or Atlas)
- Google OAuth credentials for Authentication
- Telegram Bot Token (for sending alerts)

## Setup & Installation

### 1. Clone the repository
```bash
git clone <your-repository-url>
cd WeatherGuard
```

### 2. Backend Setup (`api/`)
Navigate to the `api` directory and install the dependencies:
```bash
cd api
npm install
```

Create a `.env` file in the `api/` directory based on the expected environment variables (e.g., `MONGO_URI`, `JWT_SECRET`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `TELEGRAM_BOT_TOKEN`, etc.).

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

Create a `.env` file in the `frontend/` directory and configure the environment variables (e.g., `VITE_API_URL`).

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
- React 18
- TypeScript
- Vite
- TailwindCSS
- React Router DOM
- Lucide React (Icons)

**Backend:**
- Node.js
- NestJS
- MongoDB / Mongoose
- JWT Authentication
- Google Auth Library
- Telegraf (Telegram Bot API)

## License

This project is licensed under the MIT License.
