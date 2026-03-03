# Negotiation Flow (ML Assets)

This page documents the negotiation UX and state flow used by `ML Assets`.

## Entry point

- Route: `/ml-assets`
- Action button: `Negotiate` on external asset cards

## Gating rules

Negotiation button is disabled when:
- asset is local
- `hasAgreement = true`
- `negotiationInProgress = true`

## UI flow

1. User clicks `Negotiate`.
2. Dashboard resolves catalog dataset + offers for the selected external asset.
3. Modal opens with Catalog-like negotiation form (offer selection + offer details).
4. User submits negotiation request.
5. Progress modal opens with state stepper:
   - `INITIAL -> REQUESTED -> OFFERED -> ACCEPTED -> AGREED -> VERIFIED -> FINALIZED`
6. Terminal state handling:
   - `FINALIZED`: set `hasAgreement = true`, clear `negotiationInProgress`
   - `TERMINATED` or failure: clear `negotiationInProgress`

## Data sources used in the flow

- Primary: `CatalogService.getCatalogDataset(...)` (same path used by catalog module)
- Fallback: current ML asset payload + contract offers from extension response

## Relevant files

- `DataDashboard/src/app/features/ml-assets-browser/ml-assets-browser.component.ts`
- `DataDashboard/src/app/features/ml-contract-negotiation/ml-contract-negotiation.component.ts`
- `DataDashboard/src/app/features/ml-negotiation-progress/ml-negotiation-progress.component.ts`
- `DataDashboard/projects/dashboard-core/catalog/src/catalog.service.ts`
