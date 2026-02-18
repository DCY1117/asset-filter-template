# Model Execution

This section documents the inference UI and how it calls the inference extension.

---

## Route
`/infer`

## Purpose
- Execute model inference using an asset id and payload.

## Components and Files
- `ui/ml-browser-app/src/app/pages/model-execution/model-execution.component.ts`
- `ui/ml-browser-app/src/app/shared/services/model-execution.service.ts`
- `ui/ml-browser-app/src/app/shared/services/ml-browser.service.ts`

## API Calls
- `POST {inferApiUrl}`
- `POST {filterApiUrl}` (external assets for execution list)
- `POST {activeManagementUrl}/v3/assets/request` (local assets for execution list)
- `POST {activeManagementUrl}/v3/contractagreements/request` (filter external assets to negotiated ones)

## Functionality
- Loads executable assets from the merged assets list (local + external).
- Marks assets as executable when `contenttype` includes `application/json` or tags include `inference` or `endpoint`.
- Visibility rule for execution list:
  - Local assets are always shown when technically executable.
  - External assets are shown only when the current connector has a contract agreement for that asset.
- Sends `assetId`, `path`, and `payload` to `/api/infer`.
- Renders raw response as JSON.

## Status
Working for:
- local executable assets (no contract required)
- external executable assets with a contract agreement and valid inference path.

## Known Gaps
- No streaming or progress updates.
- No header customization in the UI.
- No retries or response formatting.

## Change Ideas
- Add header editor and method selector.
- Add streaming support if the backend supports it.
- Surface contract agreement status inline.
