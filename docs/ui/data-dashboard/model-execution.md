# Model Execution (DataDashboard)

## Route

- `/model-execution`

## Purpose

Run inference requests from DataDashboard against the connector infer endpoint.

## Implemented behavior

- Builds executable asset list from merged ML assets
- Marks an asset executable if:
  - technically executable (JSON content or inference/endpoint tags)
  - and either local OR externally negotiated
- Sends execution request to: `POST {activeDefaultUrl}/api/infer`
- Request body includes:
  - `assetId`
  - `path`
  - `method`
  - `headers`
  - `payload`

## Key files

- `DataDashboard/src/app/features/model-execution/model-execution.component.ts`
- `DataDashboard/src/app/features/model-execution/model-execution.component.html`
- `DataDashboard/src/app/services/dashboard-model-execution.service.ts`

## Notes

- Inference path is auto-resolved from metadata (`daimo:inference_path` variants), fallback `/infer`.
- UI validates input JSON before sending request.
- External assets are only executable after agreement is present.
