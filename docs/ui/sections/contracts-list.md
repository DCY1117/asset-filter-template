# Contract Definitions List

This section documents the contracts page that lists contract definitions.

---

## Route
`/contracts`

## Purpose
- Display contract definitions stored on the provider connector.

## Components and Files
- `ui/ml-browser-app/src/app/pages/contracts/contracts.component.ts`
- `ui/ml-browser-app/src/app/shared/services/contract-definition.service.ts`

## API Calls
- `POST {managementApiUrl}/v3/contractdefinitions/request`

## Functionality
- Lists contract definitions with access and contract policy info.
- “View Assets” navigates to the first asset in the definition.
- “Create Contract” opens the contract definition form.

## Status
Working with minor TODOs.

## Known Gaps
- “View Details” is a placeholder.
- No delete or edit actions.

## Change Ideas
- Add a contract detail page with full JSON.
- Add delete and clone actions with confirmation.
- Link to contract negotiations created from each definition.
