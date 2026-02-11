# IA Assets Browser

This section documents the main assets list, search, filters, and actions.

---

## Route
`/ml-assets`

## Purpose
- Display the ML assets catalog with server-side filtering.
- Provide entry points to asset detail, contract creation, and negotiation.

## Components and Files
- `ui/ml-browser-app/src/app/pages/ml-assets-browser/ml-assets-browser.component.ts`
- `ui/ml-browser-app/src/app/pages/ml-assets-browser/components/ml-asset-card/*`
- `ui/ml-browser-app/src/app/pages/ml-assets-browser/components/ml-filters/*`
- `ui/ml-browser-app/src/app/components/ml-search-bar/ml-search-bar.component.ts`
- `ui/ml-browser-app/src/app/shared/services/ml-assets.service.ts`
- `ui/ml-browser-app/src/app/shared/services/ml-browser.service.ts`

## API Calls
- `POST {filterApiUrl}` with `profile=daimo` and query params.
- `POST {consumerManagementUrl}/v3/catalog/request` when opening negotiation.

## Functionality
- Server-side catalog fetch through the filter extension.
- Search uses `q=` query param on the filter endpoint.
- Filters wired to backend: task, library, framework, format.
- Pagination is client-side over the filtered list.
- Actions per asset: View Details, Create Contract (local), Negotiate (external).

## Status
Working with partial filters.

## Known Gaps
- Subtask, algorithm, storage, software, and asset source filters are UI-only.
- Framework filter maps to the same `library=` query param as library.
- Download action is a placeholder.
- Server-side pagination is not implemented.

## Change Ideas
- Wire remaining filters to `filter=` parameters.
- Add sort options and server-side pagination support.
- Use `dspace:participantId` to show asset origin.
- Add asset source detection for local vs external assets.
