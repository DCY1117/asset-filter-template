# ML Assets Browser (DataDashboard)

## Route

- `/ml-assets`

## Purpose

Provides ML Browser parity inside DataDashboard while keeping DataDashboard look-and-feel.

## Implemented behavior

- Loads external assets from filter extension: `POST {activeDefaultUrl}/api/filter/catalog`
- Falls back to management catalog request when filter base response is empty:
  - `POST {activeManagementUrl}/v3/catalog/request`
- Loads local assets from management API: `POST {activeManagementUrl}/v3/assets/request`
- Uses the same counterparty selection pattern as catalog view:
  - select configured connector from dropdown (excluding current connector)
  - or use **Request Manually** to provide counterparty address
- Merges local + external assets and keeps them distinct by source
- Supports filters:
  - search term
  - task
  - library
  - framework
  - format
  - asset source (local/external)
- Supports pagination and item count selector
- Supports contract actions:
  - local asset: route user to contract definitions
  - external asset: opens Catalog-style negotiation form and progress modals
- Supports local management actions directly on local cards:
  - `Details`
  - `Edit`
  - `Delete`
  - action icons match `Assets` page style
- View Details modal tabs:
  - `Overview`
  - `Contract Offers`
  - `Raw Payload` using compacted/expanded JSON-LD viewer (Catalog-style)

## Key files

- `DataDashboard/src/app/features/ml-assets-browser/ml-assets-browser.component.ts`
- `DataDashboard/src/app/features/ml-assets-browser/ml-assets-browser.component.html`
- `DataDashboard/src/app/features/ml-contract-negotiation/ml-contract-negotiation.component.ts`
- `DataDashboard/src/app/features/ml-negotiation-progress/ml-negotiation-progress.component.ts`
- `DataDashboard/src/app/services/dashboard-ml-browser.service.ts`
- `DataDashboard/src/app/features/ml-asset-details-modal/ml-asset-details-modal.component.ts`

## Notes

- If no counterparty is selected/requested, page still shows local assets; external query is skipped.
- Negotiation is disabled for assets already negotiated.
- For external details, payload is resolved from catalog request flow first to keep JSON-LD rendering aligned with catalog view.
