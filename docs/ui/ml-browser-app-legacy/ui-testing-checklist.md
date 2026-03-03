# UI Testing Checklist (ML Browser)

This is the UI-focused validation checklist for the ML Browser app. It captures what is implemented, what is partial, and what is not wired yet, plus step-by-step checks you can run.

---

## 1) Prereqs

 - Provider connector running. Management API: `http://localhost:19193/management`. DSP protocol: `http://localhost:19194/protocol`.
- Consumer connector running. Filter + infer extensions: `http://localhost:29191`. Management API: `http://localhost:29193/management`. DSP protocol: `http://localhost:29194/protocol`.
- Provider has assets + policy + contract definition created.
- For inference tests: a finalized contract agreement exists for the asset.

Reference flows:
- `docs/extensions/commands-reference.md`
- `docs/extensions/manual-test-samples.md`

---

## 2) Feature Status

| Feature | Status | Notes |
| --- | --- | --- |
| Login (dev auth) | Working | Dev auth uses local users in `AuthService`. |
| Login role routing | Working | Consumer/provider login drives active connector endpoints. |
| Navigation + route guards | Working | Protected routes redirect to login. |
| ML assets list (merged local + external) | Working | Merges `/v3/assets/request` and `/api/filter/catalog`. |
| Search (q=) | Working | Server-side search via filter extension. |
| Task filter | Working | Maps to `task=` query param. |
| Library filter | Working | Maps to `library=` query param. |
| Framework filter | Partial | Uses `library=` param (same as library). |
| Format filter | Working | Maps to `filter=contenttype=...`. |
| Subtask/Algorithm/Storage/Software/Asset Source filters | Not wired | UI shows them, but no server query is sent. |
| External owner badge | Working | Resolved from catalog participant metadata (with fallback). |
| External storage normalization | Working | Catalog distribution transfer format mapped to storage label. |
| Card model metadata chips | Working | Collapsed by default, expandable with count. |
| Asset detail view | Working | Unified details view via `/catalog/view` for local and external assets. |
| Asset creation (HttpData) | Working | Creates assets via active connector management API. |
| Asset creation (S3/DataSpacePrototypeStore upload) | Not wired | UI expects `/s3assets/*` endpoints not in this repo. |
| Catalog browser (consumer) | Working | Uses `/v3/catalog/request` + count endpoint. |
| Catalog detail (contract offers) | Working | Displays offer details. |
| Contract negotiation from UI | Working | Starts negotiation, polls status, and marks offers/assets as negotiated. |
| Contract definitions list | Working | Reads from active connector management API. |
| Contract definition creation | Working | Auto-creates/selects default open policy if missing. |
| Policy creation dialog | Working | Creates policy definitions on provider. |
| Model execution (infer) | Working | Calls `/api/infer` with assetId + payload. |

---

## 3) Test Checklist

### 3.1 Login + Navigation
- [ ] Login as Consumer (`user-conn-user1-demo` / `user1123`) and verify redirect to `/ml-assets`.
- [ ] Login as Provider (`user-conn-user2-demo` / `user2123`) and verify redirect to `/ml-assets`.
- [ ] Verify current connector shown in UI is `consumer` for consumer login and `provider` for provider login.
- [ ] Logout from the top-right menu and verify redirect to `/login`.
- [ ] Directly open `/ml-assets` without a token and confirm redirect to `/login`.

### 3.2 ML Assets Browser
- [ ] List loads and shows assets (no errors in console).
- [ ] List includes both Local and External badges when both sources are available.
- [ ] If local and external share the same asset id, both entries are visible.
- [ ] Search reduces results (type a known model name fragment).
- [ ] Task filter reduces results (select one task).
- [ ] Library filter reduces results (select one library).
- [ ] Format filter reduces results (e.g., `application/json`).
- [ ] Clear filters returns full list.
- [ ] Pagination works (change page and page size).
- [ ] `Model Metadata (N)` section is collapsed by default for every card.
- [ ] Click `Model Metadata (N)` and verify chips expand/collapse.
- [ ] Click “View Details” on local and external assets and verify both open `/catalog/view`.
- [ ] Click “Negotiate” on an external asset and verify status transitions to `Negotiating...` then `Negotiated` when finalized.
- [ ] After negotiation is finalized, verify negotiate button is disabled for that external asset.

### 3.3 Unified Details View
- [ ] Asset information tab loads with ID, name, version, description, and keywords.
- [ ] Contract offers tab shows action, constraints, obligations, and prohibitions when available.
- [ ] Negotiate button is disabled when offer is already negotiated.

### 3.4 Asset Creation
- [ ] Create a new HttpData asset and verify it appears in the ML assets list.
- [ ] Verify the created asset ID format is `<connector-id>~<model-name-slug>` (for example `provider~my-model`).
- [ ] Try creating another asset with the same name in the same connector and verify UI blocks it.
- [ ] Create a policy and contract definition for the new asset (via UI).
- [ ] S3/DataSpacePrototypeStore upload shows a failure or missing endpoint (expected until backend exists).

### 3.5 Catalog Browser + Detail
- [ ] Catalog list loads and shows assets with contract offers.
- [ ] Pagination works.
- [ ] Open catalog detail and verify offer list and policy terms render.
- [ ] Verify offer terms include constraints, obligations, and prohibitions when present.
- [ ] Run negotiation from detail and verify status updates (`Negotiating...` / `Negotiated`).

### 3.6 Contract Definitions
- [ ] Create a policy via the dialog.
- [ ] Create a contract definition for a selected asset.
- [ ] Contracts list shows the new definition.
- [ ] Contracts list shows the selected asset under Associated Assets.
- [ ] Contracts list shows a created date (not `N/A`) for new definitions.
- [ ] “View Assets” navigates to the asset detail page.

### 3.7 Model Execution
- [ ] Executable assets list loads.
- [ ] Local executable assets are visible without contract agreement.
- [ ] External assets without contract agreement are hidden.
- [ ] After negotiation reaches agreement, the external asset appears in execution list.
- [ ] Execute a model with valid JSON and verify output.
- [ ] Invalid JSON returns validation error in UI.

---

## 4) Known Gaps

- Some filter categories are UI-only; only task/library/framework/format are wired to the filter extension.
- S3/DataSpacePrototypeStore upload endpoints are not implemented in this repo.
