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
- `ui/ml-browser-app/src/app/shared/services/ml-assets.service.ts`

## API Calls
- `POST {managementApiUrl}/v3/policydefinitions`
- `POST {managementApiUrl}/v3/policydefinitions/request`
- `POST {managementApiUrl}/v3/contractdefinitions`
- `POST {filterApiUrl}` to list assets for selection

## Functionality
- Loads policies and allows creating new policies via dialog.
- Selects assets and builds an `assetsSelector` with `operator: in`.
- Creates the contract definition on the provider.

## Status
Working.

## Known Gaps
- Asset selection uses catalog results from the consumer filter extension, not the provider asset list.
- No validation that selected assets are local to the provider.

## Change Ideas
- Use provider management API to list local assets.
- Add policy templates for common cases.
- Add validation for empty selectors and mismatched assets.
