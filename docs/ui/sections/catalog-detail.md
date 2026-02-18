# Catalog Detail

This section documents the catalog detail view and contract offer display.

---

## Route
`/catalog/view`

## Purpose
- Show asset metadata and contract offers for a selected catalog item.

## Components and Files
- `ui/ml-browser-app/src/app/pages/catalog/catalog-detail/catalog-detail.component.ts`
- `ui/ml-browser-app/src/app/shared/services/catalog-state.service.ts`

## API Calls
- `POST {activeManagementUrl}/v3/contractnegotiations` (start negotiation)
- `GET {activeManagementUrl}/v3/contractnegotiations/{id}` (poll status)
- `POST {activeManagementUrl}/v3/contractagreements/request` (resolve negotiated state)
- `POST {activeManagementUrl}/v3/contractdefinitions/request` (best-effort policy-id enrichment)

## Functionality
- Displays contract offers with policy terms from the offer policy:
  - action
  - constraints
  - obligations
  - prohibitions
- Allows switching between asset info and offer details.
- Negotiation button is active for non-negotiated offers and shows state:
  - `Negotiate Contract`
  - `Negotiating...`
  - `Negotiated`
- Back button returns to the calling view.

## Status
Working.

## Known Gaps
- Deep linking without state redirects back to catalog.
- Policy definition IDs are not guaranteed in catalog offer payloads (offer IDs are used for negotiation).

## Change Ideas
- Fetch catalog details by id on load when state is missing.
- Add a richer policy renderer for nested duty/prohibition structures.
