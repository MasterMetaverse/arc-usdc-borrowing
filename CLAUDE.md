# CLAUDE.md

## Mission
Turn this Arc USDC borrowing sample app into a publishable DeFi lending platform that is production-oriented, secure, and ready for a coding agent to continue implementation.

Repository: `MasterMetaverse/arc-usdc-borrowing`

## Current state
This repository is a Next.js + TypeScript app demonstrating:
- USDC borrowing against cirBTC collateral on Arc testnet
- Circle Borrow Kit flows
- Circle User-Controlled Wallet setup
- Supabase authentication and activity logging
- dashboard-driven loan actions

This is a solid foundation for a DeFi product, but it is still a demo app and not yet a real platform.

## Goal
Build a DeFi platform based on the current app that includes:
- user auth and account management
- wallet onboarding and wallet ownership validation
- market discovery
- portfolio dashboard
- borrow/repay/collateral flows
- health factor and liquidation monitoring
- activity log and transaction history
- API layer with server-side validation
- secure deployment setup

## Non-goals
Do not spend time on toy examples or dead-end experiments.
Do not leave the app as a single-page demo.
Do not accept client-only trust boundaries; all critical DeFi actions must be validated server-side.

## Architecture
Use the current app structure as the foundation:

- `app/` for routes and pages
- `components/` for reusable UI
- `lib/` for API, validation, wallet, auth, activity, and finance logic
- `supabase/` for database migration scripts
- `tests/` for unit/integration tests

## Expected product scope
Implement the following product areas:

1. Homepage / portfolio dashboard
2. Market overview page
3. Market detail page
4. Borrow flow page
5. Repay flow page
6. Position details page
7. Wallet management page
8. Analytics dashboard
9. Settings / account profile
10. Admin or operator monitoring page

## Data model
Add or extend the project database in Supabase/Postgres with at least these tables:

- `users`
- `wallets`
- `markets`
- `positions`
- `quotes`
- `transactions`
- `activity_log`
- `portfolio_snapshots`

### Minimum fields
`users`
- id
- email
- created_at

`wallets`
- id
- user_id
- address
- chain
- wallet_type
- status
- created_at

`markets`
- id
- collateral_asset
- borrow_asset
- ltv
- liquidation_threshold
- apr
- utilization
- enabled
- created_at

`positions`
- id
- user_id
- wallet_id
- market_id
- collateral_amount
- borrowed_amount
- health_factor
- status
- created_at
- updated_at

`quotes`
- id
- user_id
- market_id
- collateral_required
- borrow_amount
- health_target
- expires_at
- payload
- created_at

`transactions`
- id
- user_id
- wallet_id
- market_id
- type
- amount
- hash
- status
- created_at

`activity_log`
- id
- user_id
- event_type
- payload
- created_at

## API routes to add
Create or expand the following route files under `app/api/`:

- `/api/markets`
- `/api/portfolio`
- `/api/positions`
- `/api/quotes`
- `/api/borrow`
- `/api/repay`
- `/api/collateral`
- `/api/activity`
- `/api/wallets`

All write operations must require signed-in users and validate wallet ownership before acting.

## Security requirements
These are mandatory.

- Server-only secrets only
- No secrets in client components
- Require auth for all write routes
- Bind wallet actions to the authenticated user
- Validate all request bodies with schemas
- Recalculate health factor server-side before finalizing actions
- Reject mismatched or stale quote IDs
- Rate-limit quote and write endpoints
- Log all sensitive operations to activity log
- Validate wallet address ownership consistently
- Never trust client state as the final source of truth

## Required patterns
Follow the current repo’s style and architecture as much as possible:

- Keep Next.js App Router conventions
- Keep TypeScript strictness
- Use reusable helper functions in `lib/`
- Use route validation where possible
- Keep logic separated from UI
- Add focused tests for validation, API auth, and core finance helpers

## Development priorities
Do in this order:

1. Secure auth and wallet ownership enforcement
2. Expand the app from demo dashboard into real market/portfolio pages
3. Add multi-market support and quote handling
4. Add borrow, repay, collateral flow pages
5. Add transaction and activity history
6. Add analytics and risk monitoring
7. Add polishing and production deployment config

## Build the app to support these user flows
- Sign in with Supabase
- Connect/create Circle wallet
- Select market
- View borrowing details
- Request quote
- Approve borrow action
- Monitor health factor
- Add collateral
- Withdraw collateral
- Repay USDC
- Review portfolio and transaction history

## UI requirements
Build a polished DeFi UX with:
- clean landing page
- market cards with APR, utilization, LTV, health factor information
- position cards and detail views
- wallet and portfolio summaries
- activity feed
- risk banner and alerts
- transaction confirmation states

## Code quality expectations
- Type-safe code throughout
- Real route validation
- Small reusable helpers, not giant inline logic blocks
- Good naming and consistent structure
- Avoid dead code
- Keep tests focused and meaningful
- Prefer production patterns over prototype code

## Validation and QA
Before considering the app ready:

- `npm run lint` passes
- `npm test` passes
- `npm run build` passes
- All protected routes require auth
- Wallet actions fail when ownership does not match
- Quote flow rejects stale or invalid data
- Health factor remains visible and computed consistently
- Critical actions have visible success/error states

## Recommended file additions
Add or extend these files as needed:

- `app/page.tsx` -> portfolio dashboard
- `app/markets/page.tsx`
- `app/markets/[marketId]/page.tsx`
- `app/borrow/page.tsx`
- `app/borrow/[marketId]/page.tsx`
- `app/positions/page.tsx`
- `app/positions/[positionId]/page.tsx`
- `app/wallets/page.tsx`
- `app/analytics/page.tsx`
- `components/MarketCard.tsx`
- `components/PositionCard.tsx`
- `components/BorrowForm.tsx`
- `components/RepayForm.tsx`
- `components/WalletPanel.tsx`
- `components/ActivityFeed.tsx`
- `lib/defi/markets.ts`
- `lib/defi/positions.ts`
- `lib/defi/quotes.ts`
- `lib/defi/risk.ts`
- `lib/defi/types.ts`

## Publishing readiness checklist
Before shipping, ensure:

- environment variables are configured for production
- secrets are server-side only
- login and wallet flows work in production
- all routes are protected
- rate limiting is active
- analytics and monitoring are connected
- app builds cleanly in production mode
- tests are in place for critical logic
- deployment target is configured (Vercel/Railway/etc.)

## Primary objective for the coding session
Implement the platform in a real product shape, not a demo-only app. Prioritize:
- secure app flows
- wallet/account ownership model
- borrow/repay lifecycle
- portfolio overview
- market and position management
- production-safe architecture

## Final instruction
When implementing, prefer correctness, security, and maintainability over cosmetic polish. Keep the repo aligned with Next.js and TypeScript conventions already present in this project.

If there are ambiguities, choose the more secure and more production-like option.

This is a DeFi product codebase, not a sample playground.

## Suggested PR title
`feat: transform sample borrow app into DeFi platform MVP`

## Suggested commit message
`feat: add portfolio, market, wallet and borrow platform flows`

---

This file is intended to be passed directly to Claude Code or another coding agent to continue implementation from the current repo state.
