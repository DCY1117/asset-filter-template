# Login

This section covers the login page and authentication behavior.

---

## Route
`/login`

## Purpose
- Authenticate users and store a token for route access.
- Redirect authenticated users to `/ml-assets`.

## Components and Files
- `ui/ml-browser-app/src/app/pages/login/login.component.ts`
- `ui/ml-browser-app/src/app/shared/services/auth.service.ts`
- `ui/ml-browser-app/src/app/shared/interceptors/auth.interceptor.ts`

## Functionality
- Dev-auth login with demo users when `devAuth.enabled=true`.
- Real auth flow via backend endpoints when dev-auth is disabled.
- Token stored in `localStorage` under `ml_assets_auth_token`.
- User info stored in `localStorage` under `ml_assets_current_user`.
- Auth interceptor attaches `Authorization: Bearer <token>` to requests.

## API Calls
- `POST {managementApiUrl}/auth/login` (only when dev-auth is disabled).
- `GET {managementApiUrl}/auth/me` (token verification).
- `POST {managementApiUrl}/auth/logout` (logout call).

## Configuration
- `environment.runtime.devAuth.enabled`
- `environment.runtime.managementApiUrl`

## Status
Working with dev-auth. Real auth depends on backend support for `/auth/*`.

## Known Gaps
- No real auth backend is provided by the connector runtime in this repo.
- Token expiry is not enforced in UI.
- No role-based access or tenant scoping.

## Change Ideas
- Replace `/auth/*` with real OIDC flow from `environment.runtime.oauth2`.
- Add token refresh and expiry handling.
- Add role-based route guards and menu visibility.
