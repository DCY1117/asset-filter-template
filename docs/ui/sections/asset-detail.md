# Asset Detail

This section documents the asset detail page.

---

## Route
`/assets/:id`

## Purpose
- Legacy local-asset detail page.
- Main “View Details” flow now uses `/catalog/view` for both local and external assets.

## Components and Files
- `ui/ml-browser-app/src/app/pages/asset-detail/asset-detail.component.ts`
- `ui/ml-browser-app/src/app/shared/services/asset.service.ts`

## API Calls
- `GET {activeManagementUrl}/v3/assets/{id}`

## Functionality
- Loads the asset from the active connector management API.
- Renders metadata from `edc:properties` and `edc:dataAddress`.
- Shows keywords and storage info when present.
- “Create Offer” button is a placeholder.

## Status
Legacy/limited.

## Known Gaps
- No contract offer creation or negotiation from this page.
- Daimo metadata fields are not rendered explicitly.
- Not the primary details route for the current UI flow.

## Change Ideas
- Either remove this route or keep it only for debug access.
