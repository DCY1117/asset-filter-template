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
- Quick login buttons for development:
  - `Login as Consumer` (`user-conn-user1-demo` / `user1123`)
  - `Login as Provider` (`user-conn-user2-demo` / `user2123`)
- Connector IDs used by the app after login:
  - Consumer user -> `consumer`
  - Provider user -> `provider`
- Real auth flow via backend endpoints when dev-auth is disabled.
- Token stored in `localStorage` under `ml_assets_auth_token`.
- User info stored in `localStorage` under `ml_assets_current_user`.
- Auth interceptor attaches `Authorization: Bearer <token>` to requests.
- User role (`consumer` / `provider`) is persisted and used by the UI to route connector API calls.

Important:
- `username` is only for authentication.
- `connectorId` (`consumer` or `provider`) is what the UI uses for endpoint selection and generated asset IDs.

## API Calls
- `POST {managementApiUrl}/auth/login` (only when dev-auth is disabled).
- `GET {managementApiUrl}/auth/me` (token verification).
- `POST {managementApiUrl}/auth/logout` (logout call).

## Configuration
- `environment.runtime.devAuth.enabled`
- `environment.runtime.managementApiUrl`
- `environment.runtime.providerManagementUrl`
- `environment.runtime.consumerManagementUrl`

## Status
Working with dev-auth. Real auth depends on backend support for `/auth/*`.

## Known Gaps
- No real auth backend is provided by the connector runtime in this repo.
- Token expiry is not enforced in UI.
- No role-based authorization enforcement (role is used for endpoint routing, not permissions).

## Change Ideas
- Replace `/auth/*` with real OIDC flow from `environment.runtime.oauth2`.
- Add token refresh and expiry handling.
- Add role-based route guards and menu visibility.
