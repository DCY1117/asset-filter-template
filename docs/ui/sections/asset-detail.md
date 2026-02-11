# Asset Detail

This section documents the asset detail page.

---

## Route
`/assets/:id`

## Purpose
- Show full metadata for a single asset.
- Provide a quick path back to the assets list.

## Components and Files
- `ui/ml-browser-app/src/app/pages/asset-detail/asset-detail.component.ts`
- `ui/ml-browser-app/src/app/shared/services/asset.service.ts`

## API Calls
- `GET {managementApiUrl}/v3/assets/{id}`

## Functionality
- Loads the asset from the provider management API.
- Renders metadata from `edc:properties` and `edc:dataAddress`.
- Shows keywords and storage info when present.
- “Create Offer” button is a placeholder.

## Status
Working with a placeholder for offer creation.

## Known Gaps
- No contract offer creation or negotiation from this page.
- Daimo metadata fields are not rendered explicitly.

## Change Ideas
- Show Daimo fields (pipeline tag, license, tags, metrics).
- Add raw JSON viewer for debugging.
- Link to contract definition creation with pre-selected asset.
