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
None. Data is passed from the catalog browser via `CatalogStateService`.

## Functionality
- Displays contract offers with policy details.
- Allows switching between asset info and offer details.
- Back button returns to the calling view.

## Status
Partial.

## Known Gaps
- Contract negotiation action is TODO.
- “View policy JSON” is TODO.
- Deep linking without state redirects back to catalog.

## Change Ideas
- Implement negotiation using `ContractNegotiationService`.
- Fetch catalog details by id on load when state is missing.
- Add a JSON viewer for policies and raw asset properties.
