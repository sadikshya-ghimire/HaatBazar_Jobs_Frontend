# HaatBazar Jobs - Frontend

React Native Expo app for HaatBazar Jobs platform - connecting workers with employers.

## Project Structure

```
frontend/
├── components/
│   ├── auth/              # Authentication screens (SignUp, Login, Verify)
│   ├── dashboard/         # Dashboard screens (Worker & Employer)
│   ├── registration/      # Multi-step registration forms
│   ├── home/              # Welcome/landing page
│   ├── config/            # Firebase configuration
│   ├── services/          # API services (auth, user, OTP)
│   ├── utils/             # Utilities (storage)
│   └── common/            # Shared components (CustomAlert)
├── assets/                # Images, fonts, etc.
├── App.tsx               # Main app entry point
└── package.json          # Dependencies
```

## Tech Stack

- React Native (Expo)
- Firebase Authentication (Email & Phone)
- MongoDB (User profiles & data)
- Twilio (OTP verification)
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

# Run on Web
npm run web
```

## Authentication

Supports multiple authentication methods:
- **Email Signup**: Email + Password with email verification
- **Phone Signup**: Phone number + OTP verification via Twilio
- **Login**: Email/Phone + Password
- **Forgot Password**: Reset via email or phone

## Features

### For Workers
- Multi-step registration (5 steps)
- Profile with photo, NID verification
- Skills selection (15+ categories)
- Availability calendar
- Job search and applications
- Dashboard with accepted jobs
- Messaging with employers

### For Employers
- Multi-step registration (3 steps)
- Company profile setup
- Post job openings
- Browse available workers
- Hire and manage workers
- Dashboard with posted jobs
- Messaging with workers

## User Types

- **Worker**: Skilled workers offering services (plumber, electrician, carpenter, etc.)
- **Employer**: Individuals or companies looking to hire workers

## Mobile Setup

For testing on physical devices, update the API URL in `components/config/api.config.js` with your computer's IP address.

## Environment Variables

Backend requires:
- MongoDB connection string
- Firebase credentials
- Twilio credentials (Account SID, Auth Token, Phone Number)
