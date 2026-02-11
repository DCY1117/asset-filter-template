# Navigation and Routing

This section documents the app shell, navigation menu, and route guards.

---

## Purpose
- Provide the main UI layout with toolbar and side navigation.
- Protect routes behind authentication.

## Routes
Defined in `ui/ml-browser-app/src/app/app.routes.ts`.

Primary routes:
- `/ml-assets`
- `/infer`
- `/assets/create`
- `/catalog`
- `/contracts`
- `/contract-definitions/create`

## Components and Files
- `ui/ml-browser-app/src/app/shared/components/navigation/navigation.component.ts`
- `ui/ml-browser-app/src/app/shared/guards/auth.guard.ts`
- `ui/ml-browser-app/src/app/app.routes.ts`

## Functionality
- Responsive navigation drawer using Angular Material.
- Menu items are static and not feature-flagged.
- Auth guard redirects to `/login` when token is missing.

## Status
Working.

## Known Gaps
- No role-based menu visibility.
- Guard checks only token presence, not expiry or claims.

## Change Ideas
- Tie menu items to `environment.features` and hide unavailable features.
- Add role or tenant checks in the guard.
- Show user info and active connector in the toolbar.
