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
- `POST {filterApiUrl}` (to list executable assets)

## Functionality
- Loads executable assets from the catalog.
- Marks assets as executable when `contenttype` includes `application/json` or tags include `inference` or `endpoint`.
- Sends `assetId`, `path`, and `payload` to `/api/infer`.
- Renders raw response as JSON.

## Status
Working when a contract agreement exists and the asset has a valid inference path.

## Known Gaps
- No streaming or progress updates.
- No header customization in the UI.
- No retries or response formatting.

## Change Ideas
- Add header editor and method selector.
- Add streaming support if the backend supports it.
- Surface contract agreement status inline.
