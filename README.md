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

### Testing on Physical Devices

When testing on a physical mobile device (not emulator), you need to configure the API to connect to your computer's backend server.

#### Step 1: Find Your Computer's IP Address

**In the backend folder, run:**
```bash
cd backend
npm run get-ip
```

This will show your computer's IP address (e.g., `192.168.1.74`)

**Or manually find it:**
- Mac/Linux: `ifconfig | grep "inet "`
- Windows: `ipconfig`

#### Step 2: Update Frontend Configuration

Edit `frontend/components/config/api.config.js`:
```javascript
const YOUR_COMPUTER_IP = "192.168.1.74"; // ⚠️ UPDATE THIS
```

#### Step 3: Start Backend Server

```bash
cd backend
npm start
```

You should see: `🚀 Server running on port 8080`

#### Step 4: Ensure Same WiFi Network

- Your computer and mobile device MUST be on the same WiFi network
- Don't use mobile data

#### Troubleshooting

If you see "Unable to fetch user profile" error:

1. Check backend is running: `npm start` in backend folder
2. Verify IP address is correct in `api.config.js`
3. Ensure both devices on same WiFi
4. Check firewall allows port 8080
5. See detailed guide: `MOBILE_CONNECTION_TROUBLESHOOTING.md`

## Environment Variables

Backend requires:
- MongoDB connection string
- Firebase credentials
- Twilio credentials (Account SID, Auth Token, Phone Number)
