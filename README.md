# HaatBazar Jobs - Frontend

React Native Expo app for HaatBazar Jobs platform.

## Project Structure

```
my-expo-app/
├── components/
│   ├── auth/              # Authentication screens and components
│   ├── dashboard/         # Dashboard screens (Worker & Employer)
│   ├── welcome/           # Welcome/landing page
│   ├── config/            # Firebase configuration
│   └── services/          # API services (auth, user)
├── assets/                # Images, fonts, etc.
├── App.tsx               # Main app entry point
└── package.json          # Dependencies
```

## Tech Stack

- React Native (Expo)
- Firebase Authentication
- Firestore Database
- NativeWind (Tailwind CSS)
- TypeScript

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android
```

## Authentication

Simple Firebase email/password authentication:
- Sign Up: Email + Password
- Login: Email + Password
- Forgot Password: Email reset link

## Features

- User authentication (Worker & Employer)
- User type selection
- Worker dashboard
- Employer dashboard
- Profile management
