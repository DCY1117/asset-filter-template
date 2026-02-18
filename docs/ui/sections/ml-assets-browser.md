# IA Assets Browser

This section documents the main assets list, search, filters, and actions.

---

## Route
`/ml-assets`

## Purpose
- Display both local and external ML assets in one merged list.
- Provide entry points to asset detail, contract creation, and negotiation.

## Components and Files
- `ui/ml-browser-app/src/app/pages/ml-assets-browser/ml-assets-browser.component.ts`
- `ui/ml-browser-app/src/app/pages/ml-assets-browser/components/ml-asset-card/*`
- `ui/ml-browser-app/src/app/pages/ml-assets-browser/components/ml-filters/*`
- `ui/ml-browser-app/src/app/components/ml-search-bar/ml-search-bar.component.ts`
- `ui/ml-browser-app/src/app/shared/services/ml-assets.service.ts`
- `ui/ml-browser-app/src/app/shared/services/ml-browser.service.ts`

## API Calls
- `POST {filterApiUrl}` with `profile=daimo` and query params (external assets).
- `POST {activeManagementUrl}/v3/assets/request` (local assets).
- `POST {activeManagementUrl}/v3/contractnegotiations` (start negotiation for external assets).
- `GET {activeManagementUrl}/v3/contractnegotiations/{id}` (poll status after negotiation start).
- `POST {activeManagementUrl}/v3/contractagreements/request` (mark assets as negotiated).
- `POST {activeManagementUrl}/v3/catalog/request` (fallback lookup when offer ID is missing in loaded card data).

## Functionality
- Loads external assets through the filter extension and local assets through management API, then merges both.
- Keeps local and external entries distinct even when they share the same asset id.
- Search uses `q=` query param on the filter endpoint.
- Filters wired to backend: task, library, framework, format.
- Pagination is client-side over the filtered list.
- Actions per asset:
  - `View Details` for both local and external assets opens the same detail UI (`/catalog/view`).
  - `Create Contract` for local assets.
  - `Negotiate` for external assets.
- Negotiate flow from this page:
  - starts contract negotiation directly
  - polls negotiation status
  - updates button state to `Negotiated` when finalized
- Owner badge is shown for both local and external assets (external owner resolved from catalog participant info).
- Storage is normalized:
  - Local from `dataAddress.type`
  - External inferred from distribution format (for example `HttpData-PULL`/`HttpData-PUSH` -> `HttpData`)
- Model metadata is displayed as collapsible chips:
  - Hidden by default
  - Toggle label includes count: `Model Metadata (N)`

## Status
Working with partial filters.

## Known Gaps
- Subtask, algorithm, storage, software, and asset source filters are UI-only.
- Framework filter maps to the same `library=` query param as library.
- Download action is a placeholder.
- Server-side pagination is not implemented.
- If an external asset has no usable offer ID in loaded data, negotiation falls back to catalog lookup.

## Change Ideas
- Wire remaining filters to `filter=` parameters.
- Add sort options and server-side pagination support.
- Use `dspace:participantId` to show asset origin.
- Add asset source detection for local vs external assets.
