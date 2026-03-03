# DataDashboard Implementation History

This document is the consolidated record of what was implemented and adjusted in this workspace for the DataDashboard-based GUI.

## 1) Base migration from legacy ML Browser

- Moved UI documentation to two tracks:
  - `docs/ui/ml-browser-app-legacy/` (old app)
  - `docs/ui/data-dashboard/` (current app)
- Adopted DataDashboard as primary GUI and kept custom ML features in wrapper routes/components.

## 2) Routing and navigation

- Added custom routes:
  - `/ml-assets`
  - `/model-execution`
- Added corresponding menu entries in:
  - `DataDashboard/public/config/app-config.json`

## 3) Connector configuration and frontend startup fixes

- Updated connector config format and values in:
  - `DataDashboard/public/config/edc-connector-config.json`
- Added optional base-href config file to remove 404 noise:
  - `DataDashboard/public/config/APP_BASE_HREF.txt`
- Documented local storage reset when stale connector configs are cached:
  - `edc_local_configs`
  - `currentConnector`

## 4) CORS and API-key compatibility

- Root cause identified for health-check/management failures from browser:
  - missing `x-api-key` in CORS allowed headers.
- Required connector-side CORS update documented for both connectors:
  - allow origin `http://localhost:4200`
  - include `x-api-key` in `edc.web.rest.cors.headers`

## 5) Negotiation reliability fixes

- Identified strict provider validation failure:
  - agreement policy must match offer policy shape.
- Patched catalog negotiation policy handling in:
  - `DataDashboard/projects/dashboard-core/catalog/src/catalog.service.ts`
- Behavior after patch:
  - keep offer policy mostly as-is
  - inject only mandatory missing fields (`@context`, `assigner`, `target`)

## 6) ML Assets page feature parity with catalog

- Implemented connector selection + manual request flow aligned with catalog view.
- Implemented merged list:
  - local assets from management API
  - external assets from filter extension (with management fallback)
- Added filtering facets:
  - search
  - task
  - library
  - framework
  - format
  - source (local/external)
- Added details modal with tabs and JSON-LD rendering aligned with catalog behavior.

## 7) ML Assets negotiation UX

- Reused catalog-like negotiation form and progress modal for external assets.
- Added gating:
  - no negotiation for local assets
  - no negotiation if agreement already exists
  - no negotiation while negotiation is in progress

## 8) Local asset management enhancements

- Enhanced `Assets` create/edit modal with optional ML metadata helper mapped to Daimo fields.
- Extended local asset search to include Daimo metadata values.
- Added local actions in `ML Assets` cards (same action style as `Assets`):
  - details
  - edit
  - delete
- Reused existing asset components/services for consistency:
  - `AssetCreateComponent`
  - `AssetService`
  - `DeleteConfirmComponent`
  - `AssetCardComponent`

## 9) Model execution

- Added model execution page integrated with `/api/infer`.
- Execution eligibility logic:
  - local assets are executable
  - external assets require negotiated agreement
- Inference path resolution from metadata with fallback `/infer`.

## 10) Operational constraint found (important)

- Transfer may fail with:
  - `No Endpoint generator function registered for transfer type destination 'HttpData'`
- Meaning:
  - connector runtime used as consumer is missing the data-plane transfer capability required for that destination type in this direction.
- Consequence:
  - provider->consumer flow can work while reverse direction fails unless both runtimes have symmetric data-plane/transfer support.

## Key code areas touched

- `DataDashboard/src/app/features/ml-assets-browser/`
- `DataDashboard/src/app/features/ml-contract-negotiation/`
- `DataDashboard/src/app/features/ml-negotiation-progress/`
- `DataDashboard/src/app/features/model-execution/`
- `DataDashboard/src/app/services/dashboard-ml-browser.service.ts`
- `DataDashboard/src/app/services/dashboard-model-execution.service.ts`
- `DataDashboard/projects/dashboard-core/catalog/src/catalog.service.ts`
- `DataDashboard/projects/dashboard-core/assets/src/asset-create/asset-create.component.ts`
- `DataDashboard/projects/dashboard-core/assets/src/asset-view/asset-view.component.ts`

