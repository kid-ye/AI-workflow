# 🔐 Authentication System Documentation

## Overview

This backend implements a comprehensive JWT-based authentication system with support for:

- Manual signup/login (email + password)
- Google OAuth login
- Access tokens (short-lived, 30 minutes)
- Refresh tokens (long-lived, 7 days)
- Token revocation on logout
- Account linking (manual + Google)

---

## 🏗️ Architecture

### Token Strategy

**Access Token (30 minutes)**

- Used for API authentication
- Short-lived for security
- Sent with every API request in Authorization header

**Refresh Token (7 days)**

- Used to get new access tokens
- Stored in database with revocation capability
- Allows logout from specific devices or all devices

### Database Tables

1. **users** - User accounts
2. **auth_providers** - Authentication methods per user (email, google)
3. **refresh_tokens** - Active refresh tokens with revocation tracking

---

## 🔌 API Endpoints

### Authentication Endpoints (Public)

#### 1. POST `/api/v1/auth/signup`

Manual signup with email and password

**Request:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123",
  "phone": "+1234567890",
  "user_type": "INDIVIDUAL"
}
```

**Response:**

```json
{
  "access_token": "eyJhbGc...",
  "refresh_token": "eyJhbGc...",
  "token_type": "bearer",
  "user": {
    "id": "usr_abc123",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "user_type": "INDIVIDUAL"
  }
}
```

#### 2. POST `/api/v1/auth/login`

Manual login with email and password

**Request:**

```json
{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response:** Same as signup

#### 3. POST `/api/v1/auth/google`

Google OAuth login

**Request:**

```json
{
  "id_token": "google-id-token-from-frontend"
}
```

**Response:** Same as signup

**Behavior:**

- If Google account exists → login
- If email exists (manual user) → link Google account and login
- If new user → create account and login

#### 4. POST `/api/v1/auth/refresh`

Get new access token using refresh token

**Request:**

```json
{
  "refresh_token": "eyJhbGc..."
}
```

**Response:**

```json
{
  "access_token": "eyJhbGc...",
  "token_type": "bearer"
}
```

#### 5. POST `/api/v1/auth/logout`

Logout from current device

**Request:**

```json
{
  "refresh_token": "eyJhbGc..."
}
```

**Response:**

```json
{
  "message": "Logged out successfully"
}
```

#### 6. GET `/api/v1/auth/methods/{email}`

Check available login methods for an email

**Response:**

```json
{
  "has_password": true,
  "providers": ["email", "google"],
  "can_login_with_email": true,
  "can_login_with_google": true
}
```

### Protected Endpoints (Require Authentication)

#### 7. GET `/api/v1/auth/me`

Get current user information

**Headers:**

```
Authorization: Bearer eyJhbGc...
```

**Response:**

```json
{
  "id": "usr_abc123",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "user",
  "user_type": "INDIVIDUAL",
  "plan_type": "free",
  "email_verified": false
}
```

#### 8. POST `/api/v1/auth/logout-all`

Logout from all devices

**Headers:**

```
Authorization: Bearer eyJhbGc...
```

**Response:**

```json
{
  "message": "Logged out from all devices"
}
```

#### 9. POST `/api/v1/auth/set-password`

Set password for Google-only users

**Headers:**

```
Authorization: Bearer eyJhbGc...
```

**Request:**

```json
{
  "password": "newpassword123"
}
```

**Response:**

```json
{
  "message": "Password set successfully"
}
```

---

## 🛡️ Protected API Routes

All other API endpoints now require authentication:

### Agents API

- `POST /api/v1/agents/` - Create agent ✅ Protected
- `GET /api/v1/agents/{agent_id}` - Get agent ✅ Protected
- `GET /api/v1/agents/` - List agents ✅ Protected
- `PUT /api/v1/agents/{agent_id}` - Update agent ✅ Protected
- `DELETE /api/v1/agents/{agent_id}` - Delete agent ✅ Protected

### Users API

- All user endpoints ✅ Protected

### All Other APIs

- Voices, Models, Realtime Agents, etc. - Need to be updated similarly

---

## 💻 Frontend Integration

### 1. Login Flow

```javascript
// Manual Login
const response = await fetch("/api/v1/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    email: "user@example.com",
    password: "password123",
  }),
});

const data = await response.json();
// Store tokens
localStorage.setItem("access_token", data.access_token);
localStorage.setItem("refresh_token", data.refresh_token);
```

### 2. Google OAuth Flow

```javascript
// After getting Google ID token from Google Sign-In
const response = await fetch("/api/v1/auth/google", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    id_token: googleIdToken,
  }),
});

const data = await response.json();
localStorage.setItem("access_token", data.access_token);
localStorage.setItem("refresh_token", data.refresh_token);
```

### 3. Making Authenticated Requests

```javascript
const accessToken = localStorage.getItem("access_token");

const response = await fetch("/api/v1/agents/", {
  method: "GET",
  headers: {
    Authorization: `Bearer ${accessToken}`,
  },
});
```

### 4. Handling Token Expiration

```javascript
async function makeAuthenticatedRequest(url, options = {}) {
  let accessToken = localStorage.getItem("access_token");

  // Try request with current access token
  let response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${accessToken}`,
    },
  });

  // If 401, refresh token and retry
  if (response.status === 401) {
    const refreshToken = localStorage.getItem("refresh_token");

    const refreshResponse = await fetch("/api/v1/auth/refresh", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (refreshResponse.ok) {
      const data = await refreshResponse.json();
      localStorage.setItem("access_token", data.access_token);

      // Retry original request
      response = await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${data.access_token}`,
        },
      });
    } else {
      // Refresh failed, redirect to login
      window.location.href = "/login";
    }
  }

  return response;
}
```

### 5. Logout

```javascript
async function logout() {
  const refreshToken = localStorage.getItem("refresh_token");

  await fetch("/api/v1/auth/logout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh_token: refreshToken }),
  });

  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  window.location.href = "/login";
}
```

---

## 🔧 Backend Usage

### Protecting New Endpoints

```python
from fastapi import APIRouter, Depends
from app.core.middleware import get_current_user
from app.models.user import User

router = APIRouter()

@router.get("/protected-route")
def protected_route(current_user: User = Depends(get_current_user)):
    # current_user is automatically populated from JWT token
    return {
        "message": f"Hello {current_user.name}",
        "user_id": current_user.id
    }
```

### Optional Authentication

```python
from app.core.middleware import get_optional_user

@router.get("/optional-auth")
def optional_auth_route(current_user: User = Depends(get_optional_user)):
    if current_user:
        return {"message": f"Hello {current_user.name}"}
    else:
        return {"message": "Hello guest"}
```

---

## 🔐 Security Features

✅ **Bcrypt password hashing** - Passwords never stored in plaintext
✅ **JWT tokens** - Stateless authentication
✅ **Short-lived access tokens** - 30 minutes expiration
✅ **Refresh token rotation** - New refresh token on each use (optional)
✅ **Token revocation** - Logout invalidates refresh tokens
✅ **Account linking** - Merge manual and Google accounts
✅ **Email uniqueness** - One email = one account
✅ **Active user check** - Deactivated users cannot login
✅ **Google OAuth verification** - Validates Google ID tokens

---

## 📝 Environment Variables

Add to `.env`:

```env
SECRET_KEY=your-secret-key-here-use-openssl-rand-hex-32
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

Generate SECRET_KEY:

```bash
openssl rand -hex 32
```

---

## 🚀 Next Steps

1. ✅ Authentication system created
2. ✅ Agents and Users APIs protected
3. ⏳ Protect remaining APIs (voices, models, etc.)
4. ⏳ Add role-based access control (RBAC)
5. ⏳ Add email verification
6. ⏳ Add password reset functionality
7. ⏳ Add rate limiting

---

## 📊 Token Flow Diagram

```
┌─────────────┐
│   Client    │
└──────┬──────┘
       │
       │ 1. Login (email/password or Google)
       ▼
┌─────────────────┐
│   Auth API      │
└────────┬────────┘
         │
         │ 2. Validate credentials
         ▼
┌─────────────────┐
│   Database      │
└────────┬────────┘
         │
         │ 3. Generate tokens
         ▼
┌─────────────────┐
│  Access Token   │ (30 min)
│  Refresh Token  │ (7 days)
└────────┬────────┘
         │
         │ 4. Return to client
         ▼
┌─────────────────┐
│  Client stores  │
│  in localStorage│
└────────┬────────┘
         │
         │ 5. Use access token for API calls
         ▼
┌─────────────────┐
│  Protected API  │
└────────┬────────┘
         │
         │ 6. Validate token
         ▼
┌─────────────────┐
│  Return data    │
└─────────────────┘
```

---

## ❓ FAQ

**Q: How long do tokens last?**
A: Access tokens last 30 minutes, refresh tokens last 7 days.

**Q: What happens when access token expires?**
A: Frontend should use refresh token to get a new access token.

**Q: Can I logout from all devices?**
A: Yes, use `/api/v1/auth/logout-all` endpoint.

**Q: Can a user have both email and Google login?**
A: Yes, accounts are automatically linked by email.

**Q: Are tokens stored in database?**
A: Only refresh tokens are stored (for revocation). Access tokens are stateless.

**Q: How to add authentication to new endpoints?**
A: Add `current_user: User = Depends(get_current_user)` parameter.
