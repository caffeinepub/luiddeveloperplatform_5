# LuidDeveloperPlatform

## Current State
New project. No existing code.

## Requested Changes (Diff)

### Add

**Authentication System (100% Internal - Motoko)**
- User registration with username and password
- Login with internal validation
- Password hashing implemented inside the canister (SHA-256 based)
- Internal session management with token generation and expiry
- Role system: admin / user
- Internal permission middleware
- Auto-create initial admin on first canister start: username=SidneiCosta00, password=Nikebolado@4, role=admin
- Admin only created if no admin exists; survives upgrades via stable variables

**Database (Stable Variables - Motoko)**
- Users: id, username, passwordHash, role, createdAt
- Sessions: sessionToken, userId, expiresAt
- Products: id, name, description, version, price (one-time), subscriptionPrice, category, ratings (mock), createdAt
- Orders: id, userId, productId, type (purchase/subscription), purchasedAt, status
- Licenses: id, userId, productId, licenseKey, expiresAt, active
- Files: stored via blob-storage component

**Marketplace**
- Categories: Discord Bots, Automation Scripts, AI Tools, APIs
- Each product: name, description, version, one-time price, subscription price, mock reviews, buy button
- Browse, filter by category, product detail view

**Features**
- Registration and login flows
- Dashboard with stats (orders, licenses, products)
- Order history per user
- License management system
- Full CRUD for products (admin only)
- File storage using ICP blob storage
- All data global and device-synced (no localStorage/sessionStorage)

### Modify
- None (new project)

### Remove
- None (new project)

## Implementation Plan

1. **Backend (Motoko)**
   - Stable variables for users, sessions, products, orders, licenses
   - SHA-256 password hashing module
   - Auth functions: register, login, logout, validateSession
   - Role middleware: requireAdmin, requireUser
   - Auto-init admin on canister deploy
   - Product CRUD (admin-restricted create/update/delete, public read)
   - Order creation and listing
   - License generation and validation
   - File metadata storage (blob storage integration)

2. **Frontend (React + TypeScript)**
   - Auth context: stores session token in memory (no localStorage)
   - Pages: Landing, Login, Register, Dashboard, Marketplace, Product Detail, Orders, Licenses, Admin Panel
   - Admin panel: product CRUD, user management
   - Dark theme, tech startup style, responsive
   - All API calls go directly to canister; UI refreshes after mutations
   - No use of localStorage or sessionStorage anywhere
