# Design Document

## Overview

This design document outlines the implementation approach for authentication screens in the React Native Expo application. The solution leverages the existing NativeWind (Tailwind CSS) styling system and React Native components to create three authentication screens: Login, Sign Up, and Forgot Password. The design emphasizes reusability, accessibility, and a clean user experience consistent with modern mobile applications.

## Architecture

### Component Hierarchy

```
App.tsx
└── AuthNavigator (new)
    ├── LoginScreen
    │   ├── AuthContainer (shared)
    │   ├── AuthHeader (shared)
    │   ├── TextInput (shared)
    │   ├── Button (shared)
    │   └── AuthLink (shared)
    ├── SignUpScreen
    │   ├── AuthContainer (shared)
    │   ├── AuthHeader (shared)
    │   ├── TextInput (shared)
    │   ├── Button (shared)
    │   └── AuthLink (shared)
    └── ForgotPasswordScreen
        ├── AuthContainer (shared)
        ├── AuthHeader (shared)
        ├── TextInput (shared)
        ├── Button (shared)
        └── AuthLink (shared)
```

### Navigation Strategy

Since the project does not currently have a navigation library installed, we will implement a simple state-based navigation system using React state to switch between authentication screens. This approach:
- Avoids adding external dependencies initially
- Provides a foundation that can be easily migrated to React Navigation or Expo Router later
- Keeps the implementation lightweight for the authentication flow

## Components and Interfaces

### 1. AuthNavigator Component

**Purpose:** Manages navigation state between authentication screens

**Props:**
```typescript
interface AuthNavigatorProps {
  onAuthSuccess: () => void;
}
```

**State:**
```typescript
type AuthScreen = 'login' | 'signup' | 'forgotPassword';
```

**Responsibilities:**
- Maintain current screen state
- Provide navigation functions to child screens
- Handle successful authentication callback

### 2. Shared Components

#### AuthContainer

**Purpose:** Provides consistent layout wrapper for all auth screens

**Props:**
```typescript
interface AuthContainerProps {
  children: React.ReactNode;
}
```

**Features:**
- SafeAreaView integration
- Keyboard-aware scrolling
- Consistent padding and spacing

#### AuthHeader

**Purpose:** Displays screen title and optional subtitle

**Props:**
```typescript
interface AuthHeaderProps {
  title: string;
  subtitle?: string;
}
```

#### TextInput

**Purpose:** Reusable form input with validation and error display

**Props:**
```typescript
interface TextInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address';
  error?: string;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
}
```

**Features:**
- Label display
- Error message display
- Visual feedback for focus state
- Accessible touch targets

#### Button

**Purpose:** Primary action button with loading state

**Props:**
```typescript
interface ButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
}
```

**Features:**
- Loading indicator
- Disabled state styling
- Accessible touch target (minimum 44x44 points)

#### AuthLink

**Purpose:** Navigation link between auth screens

**Props:**
```typescript
interface AuthLinkProps {
  text: string;
  linkText: string;
  onPress: () => void;
}
```

### 3. Screen Components

#### LoginScreen

**Props:**
```typescript
interface LoginScreenProps {
  onNavigateToSignUp: () => void;
  onNavigateToForgotPassword: () => void;
  onLoginSuccess: () => void;
}
```

**State:**
```typescript
interface LoginState {
  email: string;
  password: string;
  errors: {
    email?: string;
    password?: string;
    general?: string;
  };
  loading: boolean;
}
```

**Validation Rules:**
- Email: Must match email regex pattern
- Password: Required field

#### SignUpScreen

**Props:**
```typescript
interface SignUpScreenProps {
  onNavigateToLogin: () => void;
  onSignUpSuccess: () => void;
}
```

**State:**
```typescript
interface SignUpState {
  email: string;
  password: string;
  confirmPassword: string;
  errors: {
    email?: string;
    password?: string;
    confirmPassword?: string;
    general?: string;
  };
  loading: boolean;
}
```

**Validation Rules:**
- Email: Must match email regex pattern
- Password: Minimum 8 characters
- Confirm Password: Must match password field

#### ForgotPasswordScreen

**Props:**
```typescript
interface ForgotPasswordScreenProps {
  onNavigateToLogin: () => void;
}
```

**State:**
```typescript
interface ForgotPasswordState {
  email: string;
  errors: {
    email?: string;
  };
  loading: boolean;
  success: boolean;
}
```

**Validation Rules:**
- Email: Must match email regex pattern

## Data Models

### Validation Utilities

```typescript
interface ValidationResult {
  isValid: boolean;
  error?: string;
}

interface ValidationRules {
  validateEmail: (email: string) => ValidationResult;
  validatePassword: (password: string) => ValidationResult;
  validatePasswordMatch: (password: string, confirmPassword: string) => ValidationResult;
}
```

### Email Validation Pattern
```typescript
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
```

## Error Handling

### Validation Errors

**Display Strategy:**
- Show errors below respective input fields
- Use red text color for error messages
- Add red border to input fields with errors
- Clear errors when user starts typing

**Error Messages:**
- Email invalid: "Please enter a valid email address"
- Password too short: "Password must be at least 8 characters"
- Passwords don't match: "Passwords do not match"
- Required field: "This field is required"

### Form Submission Errors

**Display Strategy:**
- Show general errors at the top of the form
- Use a distinct error container with background color
- Provide actionable error messages

**Simulated Responses:**
Since this is a UI-only implementation without backend integration:
- Login: Simulate success after validation passes
- Sign Up: Simulate success after validation passes
- Forgot Password: Show success message after validation passes

## Testing Strategy

### Component Testing Focus

1. **Form Validation Testing**
   - Verify email format validation
   - Verify password length validation
   - Verify password match validation
   - Verify error message display

2. **Navigation Testing**
   - Verify screen transitions work correctly
   - Verify navigation links trigger correct screen changes

3. **Accessibility Testing**
   - Verify touch targets meet minimum size requirements
   - Verify keyboard types are appropriate for input fields
   - Verify secure text entry for password fields

4. **User Interaction Testing**
   - Verify keyboard dismissal on outside tap
   - Verify loading states display correctly
   - Verify form submission with valid data

## Styling Approach

### Design System

**Color Palette:**
- Primary: Blue (#3B82F6) - for buttons and links
- Error: Red (#EF4444) - for error messages and borders
- Text Primary: Gray-900 (#111827)
- Text Secondary: Gray-600 (#4B5563)
- Border: Gray-300 (#D1D5DB)
- Background: White (#FFFFFF)

**Typography:**
- Screen Title: text-2xl font-bold
- Input Label: text-sm font-medium
- Button Text: text-base font-semibold
- Error Text: text-sm text-red-600
- Link Text: text-sm text-blue-600

**Spacing:**
- Screen Padding: px-6 py-8
- Input Spacing: mb-4
- Button Height: h-12
- Input Height: h-12

### Responsive Considerations

- Use KeyboardAvoidingView for iOS
- Use ScrollView to ensure content is accessible when keyboard is visible
- Maintain consistent spacing across different screen sizes
- Support both portrait and landscape orientations

## File Structure

```
components/
├── auth/
│   ├── AuthNavigator.tsx
│   ├── screens/
│   │   ├── LoginScreen.tsx
│   │   ├── SignUpScreen.tsx
│   │   └── ForgotPasswordScreen.tsx
│   ├── shared/
│   │   ├── AuthContainer.tsx
│   │   ├── AuthHeader.tsx
│   │   ├── TextInput.tsx
│   │   ├── Button.tsx
│   │   └── AuthLink.tsx
│   └── utils/
│       └── validation.ts
```

## Integration with Existing App

### App.tsx Modification

The App.tsx will be updated to conditionally render either the AuthNavigator or the main app content based on authentication state:

```typescript
const [isAuthenticated, setIsAuthenticated] = useState(false);

return isAuthenticated ? (
  <MainAppContent />
) : (
  <AuthNavigator onAuthSuccess={() => setIsAuthenticated(true)} />
);
```

### Tailwind Configuration

Update tailwind.config.js to include the new auth components directory:

```javascript
content: [
  './App.{js,ts,tsx}',
  './components/**/*.{js,ts,tsx}'
]
```

This ensures all auth component styles are properly processed.
