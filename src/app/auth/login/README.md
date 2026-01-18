# Login Module Structure

This directory contains the login/authentication module organized into separate concerns following clean architecture principles.

## Folder Structure

```
login/
├── api/              # API calls and network requests
│   ├── auth.api.ts   # Mock authentication API calls (login, register, logout)
│   └── index.ts      # API exports
├── constants/        # Constant values and configurations  
│   └── userTypes.ts  # User type definitions with icons and descriptions
├── dtos/            # Data Transfer Objects
│   └── index.ts      # Request and Response DTOs for API calls
├── enums/           # Enumeration types
│   └── index.ts      # UserTypeEnum and AuthTabEnum
├── hooks/           # Custom React hooks
│   ├── useAuth.ts         # Authentication logic hook
│   ├── useLoginForm.ts    # Login form state management
│   ├── useRegisterForm.ts # Register form state management
│   └── index.ts           # Hook exports
├── types/           # TypeScript type definitions
│   └── index.ts      # Interface definitions for forms and data structures
└── page.tsx         # Main login page component

## Usage

### Using the Auth Hook

```typescript
import { useAuth } from './hooks';

const { handleLogin, handleRegister, isLoading } = useAuth(onLoginCallback);
```

### Using Form Hooks

```typescript
import { useLoginForm, useRegisterForm } from './hooks';

const { loginData, updateLoginData, setDemoCredentials } = useLoginForm();
const { registerData, updateRegisterData } = useRegisterForm();
```

### Calling APIs Directly

```typescript
import { loginApi, registerApi } from './api';

const response = await loginApi({ email, password, userType });
```

## Mock API

The authentication uses mock API calls with simulated network delays:
- Login delay: 1000ms
- Register delay: 1500ms
- Logout delay: 300ms

All authentication data is stored in `sessionStorage` for demo purposes.

## User Types

Available user types:
- Student
- Agent
- Super Administrator

Each user type has associated permissions and UI customizations.
