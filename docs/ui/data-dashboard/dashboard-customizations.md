# DataDashboard Customizations

This file tracks the dashboard changes made in this workspace (compared to upstream DataDashboard defaults).

## UI routes and pages

- Added `ML Assets` route: `/ml-assets`
- Added `Model Execution` route: `/model-execution`
- Added menu entries in `DataDashboard/public/config/app-config.json`

## ML Assets page

- Implemented merged asset view:
  - external assets from filter extension
  - local assets from management API
- Added server-driven and client-side filters (tasks, libraries, frameworks, formats, source)
- Added Catalog-style connector selection and manual catalog request
- Added `View Details` modal with compacted and expanded JSON-LD rendering
- Added local asset actions in ML cards using the same icon/button pattern as `Assets`:
  - details (`info`)
  - edit (`edit`)
  - delete (`delete`)
- Local edit/delete in ML page reuses dashboard-core assets components/services for consistency:
  - `AssetCreateComponent`
  - `AssetService`
  - `DeleteConfirmComponent`
  - `AssetCardComponent`

## Local assets page (`Assets`)

- Kept default asset create/edit flow and added optional ML metadata helper fields.
- Helper maps metadata to Daimo properties (`daimo:*`) without removing generic property editing.
- Asset search now matches Daimo metadata values to locate local model assets faster.

## Negotiation flow in ML Assets

- Reused Catalog negotiation UX pattern for ML Assets:
  - negotiation form modal with offer selection
  - negotiation progress stepper modal
- Added gating on action buttons:
  - no negotiation for local assets
  - no negotiation when agreement already exists
  - no negotiation while another negotiation is in progress
- Terminal negotiation states update the ML asset card state

## Extension integration

- Filter endpoint: `POST {defaultUrl}/api/filter/catalog`
- Infer endpoint: `POST {defaultUrl}/api/infer`
- Management fallback for external catalog when filtered response is empty:
  - `POST {managementUrl}/v3/catalog/request`

## Policy compatibility patch (dashboard-core)

- Patched `DataDashboard/projects/dashboard-core/catalog/src/catalog.service.ts`
- `getOfferMap(...)` keeps offer policies as-is and injects only missing mandatory fields:
  - `@context`
  - `assigner`
  - `target`

This avoids provider-side strict policy mismatch failures while keeping negotiation valid.
