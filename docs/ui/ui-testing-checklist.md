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
| Navigation + route guards | Working | Protected routes redirect to login. |
| ML assets list (catalog via filter extension) | Working | Uses `/api/filter/catalog` with `profile=daimo`. |
| Search (q=) | Working | Server-side search via filter extension. |
| Task filter | Working | Maps to `task=` query param. |
| Library filter | Working | Maps to `library=` query param. |
| Framework filter | Partial | Uses `library=` param (same as library). |
| Format filter | Working | Maps to `filter=contenttype=...`. |
| Subtask/Algorithm/Storage/Software/Asset Source filters | Not wired | UI shows them, but no server query is sent. |
| Asset detail view | Working | Loads from provider management API. |
| Asset creation (HttpData) | Working | Creates assets via provider management API. |
| Asset creation (S3/DataSpacePrototypeStore upload) | Not wired | UI expects `/s3assets/*` endpoints not in this repo. |
| Catalog browser (consumer) | Working | Uses `/v3/catalog/request` + count endpoint. |
| Catalog detail (contract offers) | Working | Displays offer details. |
| Contract negotiation from UI | Not implemented | UI shows offers, but negotiate action is TODO. |
| Contract definitions list | Working | Reads from provider management API. |
| Contract definition creation | Working | Requires existing policies. |
| Policy creation dialog | Working | Creates policy definitions on provider. |
| Model execution (infer) | Working | Calls `/api/infer` with assetId + payload. |

---

## 3) Test Checklist

### 3.1 Login + Navigation
- [ ] Login with dev user `user-conn-user1-demo` / `user1123` and verify redirect to `/ml-assets`.
- [ ] Logout from the top-right menu and verify redirect to `/login`.
- [ ] Directly open `/ml-assets` without a token and confirm redirect to `/login`.

### 3.2 ML Assets Browser
- [ ] List loads and shows assets (no errors in console).
- [ ] Search reduces results (type a known model name fragment).
- [ ] Task filter reduces results (select one task).
- [ ] Library filter reduces results (select one library).
- [ ] Format filter reduces results (e.g., `application/json`).
- [ ] Clear filters returns full list.
- [ ] Pagination works (change page and page size).
- [ ] Click “View Details” and verify asset detail view opens.
- [ ] Click “Negotiate” to open catalog detail for the selected asset.

### 3.3 Asset Detail
- [ ] Asset detail loads with ID, name, version, description, and keywords.
- [ ] Storage info is populated when asset has data address fields.
- [ ] “Create Offer” shows info message (expected, not implemented).

### 3.4 Asset Creation
- [ ] Create a new HttpData asset and verify it appears in the ML assets list.
- [ ] Create a policy and contract definition for the new asset (via UI).
- [ ] S3/DataSpacePrototypeStore upload shows a failure or missing endpoint (expected until backend exists).

### 3.5 Catalog Browser + Detail
- [ ] Catalog list loads and shows assets with contract offers.
- [ ] Pagination works.
- [ ] Open catalog detail and verify offer list and policy info render.
- [ ] Negotiation action is TODO (expected).

### 3.6 Contract Definitions
- [ ] Create a policy via the dialog.
- [ ] Create a contract definition for a selected asset.
- [ ] Contracts list shows the new definition.
- [ ] “View Assets” navigates to the asset detail page.

### 3.7 Model Execution
- [ ] Executable assets list loads (only assets with `contenttype: application/json` or `tags` include `inference`/`endpoint`).
- [ ] Execute a model with valid JSON and verify output.
- [ ] Invalid JSON returns validation error in UI.

---

## 4) Known Gaps

- Contract negotiation from UI is not implemented yet.
- Some filter categories are UI-only; only task/library/framework/format are wired to the filter extension.
- S3/DataSpacePrototypeStore upload endpoints are not implemented in this repo.
