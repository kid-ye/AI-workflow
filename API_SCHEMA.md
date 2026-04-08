# Create Agent API Schema

## Endpoint

```
POST /api/agents
```

## Request Headers

```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer <token>"
}
```

## Request Body Schema

```json
{
  "name": "string",
  "description": "string",
  "template": "string",
  "persona": "string",
  "scope": "string",
  "governance": "string",
  "security": "string",
  "model": "string",
  "voice": "string",
  "language": "string"
}
```

## Field Details

### Step 1: Basic Configuration

| Field         | Type   | j Required | Description           | Validation                                   |
| ------------- | ------ | ---------- | --------------------- | -------------------------------------------- |
| `name`        | string | Yes        | Agent name/identifier | Min 1 char, Max 255 chars                    |
| `description` | string | No         | What the agent does   | Max 1000 chars                               |
| `template`    | string | Yes        | Agent template type   | Enum: `"Realtime"`, `"Custom"`, `"OS Stack"` |

### Step 2: Persona & Scope

| Field     | Type   | Required | Description                    | Validation                   |
| --------- | ------ | -------- | ------------------------------ | ---------------------------- |
| `persona` | string | Yes      | Agent's personality and tone   | Min 10 chars, Max 2000 chars |
| `scope`   | string | Yes      | Topics/tasks the agent handles | Min 10 chars, Max 2000 chars |

### Step 3: Governance & Security

| Field        | Type   | Required | Description                              | Validation                   |
| ------------ | ------ | -------- | ---------------------------------------- | ---------------------------- |
| `governance` | string | Yes      | Compliance rules, escalation paths       | Min 10 chars, Max 2000 chars |
| `security`   | string | Yes      | Security policies, data protection rules | Min 10 chars, Max 2000 chars |

### Step 4: Model Configuration

| Field      | Type   | Required | Description            | Validation                                                                      |
| ---------- | ------ | -------- | ---------------------- | ------------------------------------------------------------------------------- |
| `model`    | string | Yes      | AI model to use        | Enum: `"GPT-4o"`, `"GPT-4 Turbo"`, `"Custom Model"`, `"Claude 3.5"`             |
| `voice`    | string | No       | Voice for audio output | Enum: `"Alloy"`, `"Echo"`, `"Fable"`, `"Onyx"`, `"Nova"`, `"Shimmer"`           |
| `language` | string | Yes      | Primary language       | Enum: `"English"`, `"Hindi"`, `"Spanish"`, `"French"`, `"German"`, `"Japanese"` |

## Example Request

```json
{
  "name": "Support Agent Alpha",
  "description": "Handles tier-1 customer support inquiries and ticket creation",
  "template": "Realtime",
  "persona": "Friendly, professional, and empathetic. Uses clear language and maintains a helpful tone throughout conversations. Patient with customers and focuses on problem resolution.",
  "scope": "Customer support inquiries, product troubleshooting, account management, basic technical issues, ticket creation and routing to appropriate teams.",
  "governance": "Must escalate to human agent if customer requests it. Cannot make refund decisions over $100. Must log all interactions. Follow GDPR compliance for EU customers.",
  "security": "All conversations encrypted end-to-end. PII data masked in logs. No storage of payment information. Session timeout after 30 minutes of inactivity.",
  "model": "GPT-4o",
  "voice": "Alloy",
  "language": "English"
}
```

## Response Schema

### Success Response (201 Created)

```json
{
  "success": true,
  "data": {
    "id": "agent_abc123xyz",
    "name": "Support Agent Alpha",
    "description": "Handles tier-1 customer support inquiries and ticket creation",
    "template": "Realtime",
    "persona": "Friendly, professional, and empathetic...",
    "scope": "Customer support inquiries, product troubleshooting...",
    "governance": "Must escalate to human agent if customer requests it...",
    "security": "All conversations encrypted end-to-end...",
    "model": "GPT-4o",
    "voice": "Alloy",
    "language": "English",
    "status": "active",
    "createdBy": "user_xyz789",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  },
  "message": "Agent created successfully"
}
```

### Error Response (400 Bad Request)

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      {
        "field": "name",
        "message": "Agent name is required"
      },
      {
        "field": "template",
        "message": "Invalid template value. Must be one of: Realtime, Custom, OS Stack"
      }
    ]
  }
}
```

### Error Response (401 Unauthorized)

```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Invalid or missing authentication token"
  }
}
```

### Error Response (500 Internal Server Error)

```json
{
  "success": false,
  "error": {
    "code": "INTERNAL_ERROR",
    "message": "An unexpected error occurred while creating the agent"
  }
}
```

## Validation Rules

### Required Fields

- `name` (Step 1)
- `template` (Step 1)
- `persona` (Step 2)
- `scope` (Step 2)
- `governance` (Step 3)
- `security` (Step 3)
- `model` (Step 4)
- `language` (Step 4)

### Optional Fields

- `description` (Step 1)
- `voice` (Step 4)

### Field Constraints

```typescript
{
  name: {
    minLength: 1,
    maxLength: 255,
    pattern: /^[a-zA-Z0-9\s\-_]+$/
  },
  description: {
    maxLength: 1000
  },
  template: {
    enum: ["Realtime", "Custom", "OS Stack"]
  },
  persona: {
    minLength: 10,
    maxLength: 2000
  },
  scope: {
    minLength: 10,
    maxLength: 2000
  },
  governance: {
    minLength: 10,
    maxLength: 2000
  },
  security: {
    minLength: 10,
    maxLength: 2000
  },
  model: {
    enum: ["GPT-4o", "GPT-4 Turbo", "Custom Model", "Claude 3.5"]
  },
  voice: {
    enum: ["Alloy", "Echo", "Fable", "Onyx", "Nova", "Shimmer"],
    optional: true
  },
  language: {
    enum: ["English", "Hindi", "Spanish", "French", "German", "Japanese"]
  }
}
```

## Frontend Validation

The frontend performs the following validations before allowing progression:

**Step 1 → Step 2:**

- `name` must not be empty
- `template` must be selected

**Step 2 → Step 3:**

- `persona` must not be empty
- `scope` must not be empty

**Step 3 → Step 4:**

- `governance` must not be empty
- `security` must not be empty

**Step 4 → Submit:**

- `model` must be selected
- `language` must be selected

## Notes for Backend Developer

1. **Authentication**: Endpoint requires valid JWT token in Authorization header
2. **User Context**: Extract user ID from token to set `createdBy` field
3. **ID Generation**: Generate unique agent ID (e.g., `agent_` prefix + UUID)
4. **Timestamps**: Auto-generate `createdAt` and `updatedAt` on server
5. **Status**: Default status should be `"active"` or `"draft"` based on business logic
6. **Sanitization**: Sanitize all text inputs to prevent XSS/injection attacks
7. **Rate Limiting**: Consider rate limiting (e.g., max 10 agents per user per hour)
8. **Database**: Store in agents table with proper indexing on `createdBy` and `createdAt`
9. **Audit Log**: Log agent creation events for compliance/audit trail
10. **Webhooks**: Consider triggering webhook events for agent creation if needed

## Additional Endpoints Needed

```
GET    /api/agents              - List all agents for authenticated user
GET    /api/agents/:id          - Get single agent details
PUT    /api/agents/:id          - Update agent configuration
DELETE /api/agents/:id          - Delete/archive agent
PATCH  /api/agents/:id/status   - Update agent status (active/inactive)
```
