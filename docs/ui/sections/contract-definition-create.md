# Create Contract Definition

This section documents the contract definition creation flow.

---

## Route
`/contract-definitions/create`

## Purpose
- Create a contract definition and link policies to asset selectors.

## Components and Files
- `ui/ml-browser-app/src/app/pages/contract-definitions/contract-definition-new/contract-definition-new.component.ts`
- `ui/ml-browser-app/src/app/pages/contract-definitions/policy-create-dialog/policy-create-dialog.component.ts`
- `ui/ml-browser-app/src/app/shared/services/policy.service.ts`
- `ui/ml-browser-app/src/app/shared/services/contract-definition.service.ts`
- `ui/ml-browser-app/src/app/shared/services/contract-sequence.service.ts`
- `ui/ml-browser-app/src/app/shared/services/ml-assets.service.ts`

## API Calls
- `POST {activeApiUrl}/api/contract-sequences/peek` (preview next contract definition ID)
- `POST {activeApiUrl}/api/contract-sequences/commit` (commit sequence index after successful create)
- `POST {activeManagementUrl}/v3/policydefinitions`
- `POST {activeManagementUrl}/v3/policydefinitions/request`
- `POST {activeManagementUrl}/v3/contractdefinitions`
- `POST {activeManagementUrl}/v3/assets/request` (through `MlAssetsService`) for local assets

## Functionality
- Auto-generates contract definition ID as `<userId>~<index>` via backend sequence allocator.
- Loads policies and allows creating new policies via dialog.
- Selects local assets only and builds an `assetsSelector` with `operator: in`.
- Creates the contract definition on the active connector.
- Commits the sequence index only after a successful create, so opening the page does not consume IDs.
- Policy dialog creates ODRL `Set` payloads aligned with `resources/requests/create-policy.json`.
- Sends `assetsSelector` as an array in create requests.
- Handles EDC response serialization where `assetsSelector` may come back as either an array or a single `Criterion` object.

## Status
Working.

## ID Generation
- Preview endpoint: `POST /api/contract-sequences/peek`
- Request body:
```json
{ "userId": "provider" }
```
- Response:
```json
{
  "userId": "provider",
  "index": 12,
  "contractDefinitionId": "provider~12"
}
```
- Commit endpoint: `POST /api/contract-sequences/commit`
- Commit request body:
```json
{ "userId": "provider", "index": 12 }
```
- Storage file (connector-side): `asset.contract.sequence.storage.file` (default `./.state/contract-sequences.json`).

## Known Gaps
- Sequence storage is file-based; for HA deployments use shared persistent storage.

## Change Ideas
- Add policy templates for common cases.
- Add optional "all local assets" template selector.
