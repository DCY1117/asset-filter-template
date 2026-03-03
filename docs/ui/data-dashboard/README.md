# DataDashboard GUI (Current)

This folder documents the current GUI implementation based on `DataDashboard`.

## Scope

- ML asset browsing with server-side filtering (`/api/filter/catalog`)
- Contract negotiation actions for external assets
- Model execution against infer endpoint (`/api/infer`)
- Local asset create/edit/delete availability inside ML Assets cards
- Known issues and troubleshooting specific to DataDashboard integration
- DataDashboard customizations done in this workspace
- Consolidated implementation history of all dashboard changes

## Files

- `docs/ui/data-dashboard/assets-local-management.md`
- `docs/ui/data-dashboard/implementation-history.md`
- `docs/ui/data-dashboard/dashboard-customizations.md`
- `docs/ui/data-dashboard/ml-assets-browser.md`
- `docs/ui/data-dashboard/negotiation-flow.md`
- `docs/ui/data-dashboard/model-execution.md`
- `docs/ui/data-dashboard/custom-dashboard-usage.md`
- `docs/ui/data-dashboard/known-issues.md`

## Source implementation

- `DataDashboard/src/app/features/ml-assets-browser/`
- `DataDashboard/src/app/features/ml-contract-negotiation/`
- `DataDashboard/src/app/features/ml-negotiation-progress/`
- `DataDashboard/src/app/features/model-execution/`
- `DataDashboard/src/app/services/dashboard-ml-browser.service.ts`
- `DataDashboard/src/app/services/dashboard-model-execution.service.ts`
- `DataDashboard/projects/dashboard-core/catalog/src/catalog.service.ts`
