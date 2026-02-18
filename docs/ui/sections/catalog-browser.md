# Catalog Browser

This section documents the catalog list view.

---

## Route
`/catalog`

## Purpose
- Show datasets with contract offers from the active connector perspective.

## Components and Files
- `ui/ml-browser-app/src/app/pages/catalog/catalog.component.ts`
- `ui/ml-browser-app/src/app/shared/services/ml-browser.service.ts`
- `ui/ml-browser-app/src/app/shared/services/catalog-state.service.ts`

## API Calls
- `POST {activeManagementUrl}/v3/catalog/request`
- `POST {activeManagementUrl}/v3/catalog/request/count`

## Functionality
- Loads catalog items with `querySpec` pagination.
- Displays contract count and basic properties.
- Opens the catalog detail view with selected item state.
- Counterparty address is selected by role (`consumer -> provider DSP`, `provider -> consumer DSP`).

## Status
Working if the count endpoint accepts the request format.

## Known Gaps
- No filtering or sorting inside this view.
- Count endpoint may require request body depending on the backend implementation.

## Change Ideas
- Add filters or reuse the filter extension output.
- Add server-side sorting and stable pagination.
- Refresh offers on navigation to detail view.
